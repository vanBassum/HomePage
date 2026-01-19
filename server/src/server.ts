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

  fastify.setErrorHandler((err: any, req, reply) => {
    const statusCode =
      typeof err?.statusCode === "number" ? err.statusCode : 500;

    // Base payload
    const payload: any = {
      statusCode,
      error:
        statusCode >= 500
          ? "Internal Server Error"
          : statusCode === 404
            ? "Not Found"
            : "Bad Request",
      message: err?.message ?? "Unexpected error",
    };

    // Normalize validation issues to a single place: top-level `issues`
    const detailsIssues = err?.details?.issues;
    if (Array.isArray(detailsIssues)) {
      payload.issues = detailsIssues;
    } else if (Array.isArray(err?.issues)) {
      payload.issues = err.issues;
    }

    // Option A (recommended): do NOT expose `details` at all
    // (If you still want extra metadata later, add it explicitly, not as a wrapper.)
    // payload.details = err.details; // <-- remove / do not include

    if (statusCode >= 500) req.log.error(err);

    reply.code(statusCode).send(payload);
  });



  // enable cors
  await fastify.register(cors, { origin: true });

  // Make sure static root is absolute (important in Docker too)
  const clientDistAbs = path.isAbsolute(CLIENT_DIST_DIR)
    ? CLIENT_DIST_DIR
    : path.resolve(process.cwd(), CLIENT_DIST_DIR);

  const hasClientBuild = existsSync(clientDistAbs);

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
