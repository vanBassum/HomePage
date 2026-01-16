import fs from "node:fs/promises";
import path from "node:path";
import type Database from "better-sqlite3";

function isSqlFile(name: string) {
  return name.toLowerCase().endsWith(".sql");
}

export async function runMigrations(db: Database.Database, migrationsDir: string): Promise<void> {
  const files = (await fs.readdir(migrationsDir))
    .filter(isSqlFile)
    .sort((a, b) => a.localeCompare(b));

  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      appliedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const hasMigrationStmt = db.prepare(
    `SELECT 1 FROM schema_migrations WHERE version = ? LIMIT 1`
  );
  const recordMigrationStmt = db.prepare(
    `INSERT INTO schema_migrations(version) VALUES (?)`
  );

  const applyTx = db.transaction((version: string, sql: string) => {
    db.exec(sql);
    recordMigrationStmt.run(version);
  });

  for (const file of files) {
    const version = file;
    const already = hasMigrationStmt.get(version);
    if (already) continue;

    const fullPath = path.join(migrationsDir, file);
    const sql = await fs.readFile(fullPath, "utf-8");

    applyTx(version, sql);
  }
}
