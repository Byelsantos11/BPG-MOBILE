const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");
const { verifyToken } = require("../middelewares/authMiddelewares");

// Criar produto
router.post("/criar", verifyToken, produtoController.criarProduto);

// Atualizar produto
router.put("/atualizar/:id", verifyToken, produtoController.atualizarProduto);

// Deletar produto
router.delete("/deletar/:id", verifyToken, produtoController.deletarProduto);

// Listar todos os produtos
router.get("/listarTodos", verifyToken, produtoController.listarProdutos);

// Buscar produto por ID
router.get("/buscaid/:id", verifyToken, produtoController.buscarProduto);

// Quantidade total de produtos
router.get("/quantidade", verifyToken, produtoController.totalProdutos);

module.exports = router;
