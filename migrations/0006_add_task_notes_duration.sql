-- Adicionar campo de notas e duração para tasks agendadas
ALTER TABLE scheduled_tasks ADD COLUMN notes TEXT;
ALTER TABLE scheduled_tasks ADD COLUMN duration INTEGER DEFAULT 60;
