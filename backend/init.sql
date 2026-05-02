CREATE DATABASE IF NOT EXISTS woodflow_db;
USE woodflow_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil ENUM('administrador', 'colaborador') DEFAULT 'colaborador',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100),
  endereco TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projetos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  cliente_id INT NOT NULL,
  prazo DATE,
  valor DECIMAL(10,2),
  status ENUM('orcamento', 'em_producao', 'concluido', 'entregue') DEFAULT 'orcamento',
  deletado_em TIMESTAMP NULL DEFAULT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS materiais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projeto_id INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL,
  unidade VARCHAR(20),
  custo DECIMAL(10,2),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
);

-- Usuário admin padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha, perfil) VALUES
('Administrador', 'admin@woodflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'administrador')
ON DUPLICATE KEY UPDATE id=id;
