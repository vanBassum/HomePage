import path from "node:path";

export const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

// In dev on Windows, default to ./data under server/
// In container, set DATA_DIR=/data
export const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "data");
export const DB_FILE = path.join(DATA_DIR, "apps.sqlite");

export const MIGRATIONS_DIR =
  process.env.MIGRATIONS_DIR ?? path.resolve(process.cwd(), "migrations");

// Optional: for production static hosting later
export const CLIENT_DIST_DIR =
  process.env.CLIENT_DIST_DIR ?? path.resolve(process.cwd(), "..", "client", "dist");
