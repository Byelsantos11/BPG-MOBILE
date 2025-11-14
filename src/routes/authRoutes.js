const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middelewares/authMiddelewares");

// Rota de login
router.post("/login", authController.login);

// Rota protegida
router.get("/perfil", verifyToken, authController.perfil);

module.exports = router;
