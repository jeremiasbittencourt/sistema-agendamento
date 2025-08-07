-- Script para criar o schema e tabela do sistema de agendamento
-- Execute este script no PostgreSQL antes de rodar a aplicação

-- Criar schema
CREATE SCHEMA IF NOT EXISTS desafio;

-- Criar tabela de contatos
CREATE TABLE IF NOT EXISTS desafio.contato (
    contato_id SERIAL PRIMARY KEY,
    contato_nome VARCHAR(100) NOT NULL,
    contato_email VARCHAR(255),
    contato_celular VARCHAR(11) NOT NULL UNIQUE,
    contato_telefone VARCHAR(10),
    contato_sn_favorito CHARACTER(1) DEFAULT 'N',
    contato_sn_ativo CHARACTER(1) DEFAULT 'S',
    contato_dh_cad TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contato_celular ON desafio.contato(contato_celular);
CREATE INDEX IF NOT EXISTS idx_contato_ativo ON desafio.contato(contato_sn_ativo);
CREATE INDEX IF NOT EXISTS idx_contato_favorito ON desafio.contato(contato_sn_favorito);
CREATE INDEX IF NOT EXISTS idx_contato_nome ON desafio.contato(contato_nome);

-- Inserir alguns dados de exemplo
INSERT INTO desafio.contato (contato_nome, contato_email, contato_celular, contato_telefone, contato_sn_favorito, contato_sn_ativo)
VALUES 
    ('João Silva', 'joao.silva@email.com', '11999999999', '1133333333', 'S', 'S'),
    ('Maria Santos', 'maria.santos@email.com', '11888888888', '1144444444', 'N', 'S'),
    ('Pedro Oliveira', 'pedro.oliveira@email.com', '11777777777', '1155555555', 'S', 'S'),
    ('Ana Costa', 'ana.costa@email.com', '11666666666', '1166666666', 'N', 'S')
ON CONFLICT (contato_celular) DO NOTHING; 