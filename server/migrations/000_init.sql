CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  appliedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS apps (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  link        TEXT NOT NULL,
  iconUrl     TEXT NULL,
  category    TEXT NULL,
  createdAt   TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS apps_updatedAt
AFTER UPDATE ON apps
FOR EACH ROW
BEGIN
  UPDATE apps SET updatedAt = datetime('now') WHERE id = NEW.id;
END;
