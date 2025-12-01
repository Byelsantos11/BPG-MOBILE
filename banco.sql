CREATE DATABASE bpgbackend;
USE bpgbackend;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes(
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
telefone VARCHAR(20) NOT NULL,
endereco VARCHAR(200) NOT NULL,
cidade VARCHAR(200) NOT NULL,
estado VARCHAR(200) NOT NULL,
data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    preco DOUBLE NOT NULL,
    estoque BIGINT NOT NULL,
    descricao TEXT,
    categoria ENUM('Notebooks', 'Smartphones', 'TVs', 'Impressoras', 'Acessórios') NOT NULL
);
CREATE TABLE IF NOT EXISTS servicos (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
cliente_id INT,
dispositivo VARCHAR(200) NOT NULL,
numero_serie VARCHAR(25) NOT NULL,
tecnico ENUM ('Michel', 'Celso'),
status_servico ENUM('Pendente', 'Em diagnóstico', 'Aguardando peças', 'Em andamento', 'Concluído', 'Cancelado'),
prioridade ENUM('Baixa', 'Média', 'Alta'),
previsao_conclusao DATE,
descricao_problema TEXT,
observacao_tecnica TEXT,
data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE ON UPDATE CASCADE
);
