require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const clienteRoutes = require("./src/routes/clienteRoutes");
const produtoRoutes = require("./src/routes/produtoRoutes");
const servicoRoutes = require("./src/routes/servicoRoutes");
const db = require("./src/configdb/connection"); 
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Testar conexão com banco
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar com o banco:", err);
  } else {
    console.log("Conectado ao banco de dados com sucesso!");
  }
});

// Rotas Autenticação
app.use("/auth", authRoutes);

// Rotas Crud (cliente)
app.use("/cliente", clienteRoutes);

// Rotas Crud (produto)
app.use("/produto", produtoRoutes);

// Rotas Crud (serviço)
app.use("/servico", servicoRoutes);


// Servidor rodando
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Servidor rodando na porta: " + PORT));
