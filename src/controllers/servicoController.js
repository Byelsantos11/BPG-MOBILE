const db = require("../configdb/connection");

/* ============================================================
   CRIAR SERVIÇO
   ============================================================ */
exports.criarServico = (req, res) => {
  const {
    cliente_id,
    dispositivo,
    numero_serie,
    tecnico,
    status_servico,
    prioridade,
    previsao_conclusao,
    descricao_problema,
    observacao_tecnica
  } = req.body;

  const sql = `
    INSERT INTO servicos (
      cliente_id,
      dispositivo,
      numero_serie,
      tecnico,
      status_servico,
      prioridade,
      previsao_conclusao,
      descricao_problema,
      observacao_tecnica
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      cliente_id,
      dispositivo,
      numero_serie,
      tecnico,
      status_servico,
      prioridade,
      previsao_conclusao,
      descricao_problema,
      observacao_tecnica
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao criar serviço:", err);
        return res.status(500).json({ message: "Erro ao criar serviço" });
      }

      return res.status(201).json({
        message: "Serviço criado com sucesso!",
        id: result.insertId
      });
    }
  );
};

/* ============================================================
   LISTAR TODOS OS SERVIÇOS (COM NOME DO CLIENTE)
   ============================================================ */
exports.listarServico = (req, res) => {
  const sql = `
    SELECT 
      s.*,
      c.nome AS cliente_nome
    FROM servicos s
    LEFT JOIN clientes c ON c.id = s.cliente_id
    ORDER BY s.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar serviços:", err);
      return res.status(500).json({ message: "Erro ao buscar serviços" });
    }

    res.json(results);
  });
};

/* ============================================================
   BUSCAR SERVIÇO POR ID (COM NOME DO CLIENTE)
   ============================================================ */
exports.buscarServico = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      s.*,
      c.nome AS cliente_nome
    FROM servicos s
    LEFT JOIN clientes c ON c.id = s.cliente_id
    WHERE s.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar serviço:", err);
      return res.status(500).json({ message: "Erro ao buscar serviço" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    res.json(results[0]);
  });
};

/* ============================================================
   ATUALIZAR SERVIÇO
   ============================================================ */
exports.atualizarServico = (req, res) => {
  const { id } = req.params;

  const {
    cliente_id,
    dispositivo,
    numero_serie,
    tecnico,
    status_servico,
    prioridade,
    previsao_conclusao,
    descricao_problema,
    observacao_tecnica
  } = req.body;

  const sql = `
    UPDATE servicos
    SET cliente_id = ?, dispositivo = ?, numero_serie = ?, tecnico = ?, 
        status_servico = ?, prioridade = ?, previsao_conclusao = ?, 
        descricao_problema = ?, observacao_tecnica = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      cliente_id,
      dispositivo,
      numero_serie,
      tecnico,
      status_servico,
      prioridade,
      previsao_conclusao,
      descricao_problema,
      observacao_tecnica,
      id
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar serviço:", err);
        return res.status(500).json({ message: "Erro ao atualizar serviço" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      res.json({ message: "Serviço atualizado com sucesso!" });
    }
  );
};

/* ============================================================
   DELETAR SERVIÇO
   ============================================================ */
exports.deletarServico = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM servicos WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar serviço:", err);
      return res.status(500).json({ message: "Erro ao deletar serviço" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    res.json({ message: "Serviço deletado com sucesso!" });
  });
};

/* ============================================================
   TOTAL DE SERVIÇOS ATIVOS
   ============================================================ */
exports.totalServicosAtivos = (req, res) => {
  const sql = `
    SELECT COUNT(*) AS total 
    FROM servicos
    WHERE status_servico IN (
      'Pendente', 
      'Em diagnóstico', 
      'Aguardando peças', 
      'Em andamento'
    )
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao contar serviços ativos:", err);
      return res.status(500).json({ message: "Erro ao contar serviços ativos" });
    }

    res.json({ total: results[0].total });
  });
};
