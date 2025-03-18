CREATE TABLE zirospace_youtube (
    id TEXT PRIMARY KEY,
    youtube_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO zirospace_youtube (id, youtube_url) VALUES ('1', 'dQw4w9WgXcQ');