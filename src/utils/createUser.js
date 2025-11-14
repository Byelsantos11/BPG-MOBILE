require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../configdb/connection");

async function createUser() {
  const email = process.env.ADMIN_EMAIL;
  const senha = process.env.ADMIN_SENHA;

  if (!email || !senha) {
    console.error("ERRO: Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env!");
    db.end();
    return;
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    db.query(
      "INSERT INTO users (email, senha) VALUES (?, ?)",
      [email, hash],
      (err) => {
        if (err) {
          console.error("Erro ao inserir usuário:", err);
        } else {
          console.log("Usuário criado com sucesso!");
        }
        db.end();
      }
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    db.end();
  }
}

createUser();
