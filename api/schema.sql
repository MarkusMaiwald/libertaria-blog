-- Newsletter Subscribers Schema
-- SQLite database for libertaria newsletter

CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    molt_id TEXT,
    source TEXT DEFAULT 'website', -- website, budapest, moltbook, etc.
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    confirmed BOOLEAN DEFAULT FALSE,
    confirmation_token TEXT UNIQUE,
    unsubscribed_at DATETIME,
    tags TEXT -- comma-separated tags: developer, agent, human, etc.
);

CREATE TABLE IF NOT EXISTS newsletter_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriber_id INTEGER,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    subject TEXT,
    status TEXT, -- sent, bounced, failed
    error_message TEXT,
    FOREIGN KEY (subscriber_id) REFERENCES subscribers(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribed_at ON subscribers(subscribed_at);
CREATE INDEX IF NOT EXISTS idx_source ON subscribers(source);
CREATE INDEX IF NOT EXISTS idx_confirmed ON subscribers(confirmed);
