const db = require("../configdb/connection");


// Criar Produto
exports.criarProduto = (req, res) => {
  const { nome, marca, modelo, preco, estoque, descricao, categoria } = req.body;

  const sql = `
    INSERT INTO produtos (nome, marca, modelo, preco, estoque, descricao, categoria)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nome, marca, modelo, preco, estoque, descricao, categoria],
    (err, result) => {
      if (err) {
        console.error("Erro ao criar produto:", err);
        return res.status(500).json({ message: "Erro ao criar produto" });
      }

      return res.status(201).json({
        message: "Produto criado com sucesso!",
        id: result.insertId
      });
    }
  );
};


// Listar Todos os Produtos
exports.listarProdutos = (req, res) => {
  db.query("SELECT * FROM produtos", (err, results) => {
    if (err) {
      console.error("Erro ao buscar produtos:", err);
      return res.status(500).json({ message: "Erro ao buscar produtos" });
    }
    res.json(results);
  });
};


// Buscar Produto por ID
exports.buscarProduto = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM produtos WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar produto:", err);
      return res.status(500).json({ message: "Erro ao buscar produto" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.json(results[0]);
  });
};


// Atualizar Produto
exports.atualizarProduto = (req, res) => {
  const { id } = req.params;
  const { nome, marca, modelo, preco, estoque, descricao, categoria } = req.body;

  const sql = `
    UPDATE produtos
    SET nome = ?, marca = ?, modelo = ?, preco = ?, estoque = ?, descricao = ?, categoria = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [nome, marca, modelo, preco, estoque, descricao, categoria, id],
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar produto:", err);
        return res.status(500).json({ message: "Erro ao atualizar produto" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      res.json({ message: "Produto atualizado com sucesso!" });
    }
  );
};


// Deletar Produto
exports.deletarProduto = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM produtos WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar produto:", err);
      return res.status(500).json({ message: "Erro ao deletar produto" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.json({ message: "Produto deletado com sucesso!" });
  });
};


// Total de Produtos
exports.totalProdutos = (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM produtos", (err, results) => {
    if (err) {
      console.error("Erro ao contar produtos:", err);
      return res.status(500).json({ message: "Erro ao contar produtos" });
    }

    res.json({ total: results[0].total });
  });
};
