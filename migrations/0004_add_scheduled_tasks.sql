-- Tabela de tasks agendadas para dias futuros
CREATE TABLE scheduled_tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    scheduled_date TEXT NOT NULL,
    scheduled_time TEXT,
    google_calendar_event_id TEXT,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT
);

-- Index para buscar tasks por usuário e data
CREATE INDEX idx_scheduled_tasks_user_date ON scheduled_tasks(user_id, scheduled_date);
