import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import path from "node:path";
import { existsSync } from "node:fs";
import { PORT, DATA_DIR, DB_FILE, MIGRATIONS_DIR, CLIENT_DIST_DIR } from "./config";
import { ensureDir, openDb } from "./db";
import { runMigrations } from "./db/migrate";
import { AppsRepo } from "./repos/appsRepo";
import { registerAppsRoutes } from "./routes/appsRoutes";

async function main() {
  const fastify = Fastify({ logger: true });

  // Make sure static root is absolute (important in Docker too)
  const clientDistAbs = path.isAbsolute(CLIENT_DIST_DIR)
    ? CLIENT_DIST_DIR
    : path.resolve(process.cwd(), CLIENT_DIST_DIR);

  const hasClientBuild = existsSync(clientDistAbs);

  // CORS: only needed when the client is served from another origin (dev Vite).
  if (!hasClientBuild) {
    await fastify.register(cors, {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
    });
  }

  await ensureDir(DATA_DIR);

  const db = openDb(DB_FILE);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  await runMigrations(db, MIGRATIONS_DIR);

  const repo = new AppsRepo(db);
  await registerAppsRoutes(fastify, repo);

  if (hasClientBuild) {
    // Serve the built client (SPA)
    await fastify.register(fastifyStatic, {
      root: clientDistAbs,
      // optional but explicit:
      // prefix: "/",
    });

    fastify.setNotFoundHandler(async (req, reply) => {
      if (req.url.startsWith("/api/")) {
        return reply.code(404).send({ message: "Not found" });
      }
      return reply.sendFile("index.html");
    });

    fastify.log.info({ clientDistAbs }, "Client static hosting enabled");
  } else {
    fastify.setNotFoundHandler(async (req, reply) => {
      if (req.url.startsWith("/api/")) {
        return reply.code(404).send({ message: "Not found" });
      }
      return reply
        .code(404)
        .send({ message: "Client build not found (run client dev server or build it)." });
    });

    fastify.log.warn({ clientDistAbs }, "Client build not found; API-only mode");
  }

  await fastify.listen({ port: PORT, host: "0.0.0.0" });
}

await main();
