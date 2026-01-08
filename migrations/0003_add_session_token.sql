-- Adicionar campo session_token para validação de sessões
ALTER TABLE users ADD COLUMN session_token TEXT;
