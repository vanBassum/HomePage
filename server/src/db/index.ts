import fs from "node:fs/promises";
import Database from "better-sqlite3";

export function openDb(dbFile: string): Database.Database {
  return new Database(dbFile);
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}
