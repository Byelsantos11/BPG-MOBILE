const express = require("express");
const router = express.Router();
const servicoController = require("../controllers/servicoController");
const { verifyToken } = require("../middelewares/authMiddelewares");
const { route } = require("./authRoutes");

// Criar serviço
router.post("/criar", verifyToken, servicoController.criarServico);

// Deletar produto
router.delete("/deletar/:id", verifyToken, servicoController.deletarServico);
// Atualizar serviço
router.put("/atualizar/:id", verifyToken, servicoController.atualizarServico);

// Listar todos os servicos
router.get("/listarTodos", verifyToken, servicoController.listarServico);

//Buscar por id os setviços
router.get("/buscaid/:id", verifyToken, servicoController.buscarServico);

//MOostrar serviços ativos
router.get("/quantidade", verifyToken, servicoController.totalServicosAtivos)


module.exports = router;
