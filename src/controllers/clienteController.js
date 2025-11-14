const db = require("../configdb/connection");


// Função de Registrar Cliente Sistema
exports.criarCliente = (req, res) => {
  const { nome, email, telefone, endereco, cidade, estado } = req.body;

  const data_cadastro = new Date();

  const sql = `
    INSERT INTO clientes (nome, email, telefone, endereco, cidade, estado, data_cadastro)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [nome, email, telefone, endereco, cidade, estado, data_cadastro],
    (err, result) => {
      if (err) {
        console.error("Erro ao criar cliente:", err);
        return res.status(500).json({ message: "Erro ao criar cliente" });
      }

      return res
        .status(201)
        .json({ message: "Cliente criado com sucesso!", id: result.insertId });
    }
  );
};

exports.listarClientes = (req, res) => {
    db.query("SELECT * FROM clientes", (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao buscar clientes" });
      }
      res.json(results);
    });
  };


  exports.buscarCliente = (req, res) => {
    const { id } = req.params;
  
    db.query("SELECT * FROM clientes WHERE id = ?", [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao buscar cliente" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      res.json(results[0]);
    });
  };


exports.atualizarCliente = (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, endereco, cidade, estado } = req.body;
  
    const query = `
      UPDATE clientes 
      SET nome = ?, email = ?, telefone = ?, endereco = ?, cidade = ?, estado = ?
      WHERE id = ?
    `;
  
    db.query(query, [nome, email, telefone, endereco, cidade, estado, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao atualizar cliente" });
      }
      res.json({ message: "Cliente atualizado com sucesso!" });
    });
  };


  exports.deletarCliente = (req, res) => {
    const { id } = req.params;
  
    db.query("DELETE FROM clientes WHERE id = ?", [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao excluir cliente" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
  
      res.json({ message: "Cliente excluído com sucesso!" });
    });
  };


  exports.totalClientes = (req, res) => {
    db.query("SELECT COUNT(*) AS total FROM clientes", (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao contar clientes" });
      }
      res.json({ total: results[0].total });
    });
  };