-- Criação da tabela 'users'
CREATE TABLE users (
    id SERIAL PRIMARY KEY,             -- Identificador único
    email VARCHAR(255) UNIQUE NOT NULL, -- Email único e obrigatório
    senha VARCHAR(255) NOT NULL         -- Senha obrigatória
);

INSERT INTO users (email, senha) VALUES 
('admin@exemplo.com', 'senha123');