const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const { verifyToken } = require("../middelewares/authMiddelewares");

// Criar cliente
router.post("/criar", verifyToken, clienteController.criarCliente);

// Deletar cliente
router.delete("/deletar/:id", verifyToken, clienteController.deletarCliente);

// Atualizar cliente
router.put("/atualizar/:id", verifyToken, clienteController.atualizarCliente);

// Listar todos
router.get("/listarTodos", verifyToken, clienteController.listarClientes);

// Buscar cliente por ID
router.get("/buscaid/:id", verifyToken, clienteController.buscarCliente);

// Contar clientes
router.get("/quantidade", verifyToken, clienteController.totalClientes);

module.exports = router;
