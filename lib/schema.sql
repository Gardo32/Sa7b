CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    group_name TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    rank TEXT,
    state TEXT,
    is_excluded INTEGER DEFAULT 0
);
