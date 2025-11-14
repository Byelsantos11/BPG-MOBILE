const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../configdb/connection");

exports.login = (req, res) => {
  const { email, senha} = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Erro no servidor" });
    if (results.length === 0) return res.status(401).json({ message: "Usuário não encontrado" });

    const user = results[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) return res.status(401).json({ message: "Senha incorreta" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ token });
  });
};

exports.perfil = (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.email}!` });
};
