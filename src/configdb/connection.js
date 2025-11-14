const mysql = require("mysql2");


// Conexão com Banco de Dados
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gabryel140404",
  database: "bpgbackend",
});

module.exports = connection;
