import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import type { AppRecord } from "../shared/models/AppRecord";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const DATA_DIR = process.env.DATA_DIR ?? "/data";
const DATA_FILE = path.join(DATA_DIR, "apps.json");

const fastify = Fastify({ logger: true });

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  if (!existsSync(DATA_FILE)) {
    await fs.writeFile(DATA_FILE, "[]\n", "utf-8");
  }
}

function badRequest(message: string) {
  const err: any = new Error(message);
  err.statusCode = 400;
  return err;
}

function internalError(message: string) {
  const err: any = new Error(message);
  err.statusCode = 500;
  return err;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Minimal runtime validation (Option B)
function validateAppRecordArray(input: unknown): asserts input is AppRecord[] {
  if (!Array.isArray(input)) throw badRequest("Body must be a JSON array");

  for (let i = 0; i < input.length; i++) {
    const r = input[i];
    if (!isPlainObject(r)) throw badRequest(`Record at index ${i} must be an object`);

    const required = ["id", "name", "title", "description", "link"] as const;
    for (const k of required) {
      if (typeof r[k] !== "string" || r[k].trim().length === 0) {
        throw badRequest(`Record at index ${i} has invalid '${k}' (must be non-empty string)`);
      }
    }

    if (r.iconUrl !== undefined && typeof r.iconUrl !== "string") {
      throw badRequest(`Record at index ${i} has invalid 'iconUrl' (must be string)`);
    }

    if (r.category !== undefined && typeof r.category !== "string") {
      throw badRequest(`Record at index ${i} has invalid 'category' (must be string)`);
    }
  }
}

async function readRecords(): Promise<AppRecord[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw internalError("Stored data is not valid JSON");
  }

  if (!Array.isArray(parsed)) {
    throw internalError("Stored data must be a JSON array");
  }

  // Do NOT reject file content here (could lock you out if file gets slightly off).
  // You can choose to validate and fix, but simplest is to trust and serve.
  return parsed as AppRecord[];
}

async function writeRecords(records: AppRecord[]) {
  await ensureDataFile();

  const raw = JSON.stringify(records, null, 2) + "\n";

  const tmp = DATA_FILE + ".tmp";
  await fs.writeFile(tmp, raw, "utf-8");
  await fs.rename(tmp, DATA_FILE);
}

// ---- API ----
fastify.get("/api/apps", async (_req, reply) => {
  const records = await readRecords();
  reply.type("application/json; charset=utf-8").send(records);
});

fastify.put("/api/apps", async (req, reply) => {
  // Accept either array (normal JSON) or stringified JSON (defensive)
  const body = req.body;

  let parsed: unknown = body;
  if (typeof body === "string") {
    try {
      parsed = JSON.parse(body);
    } catch {
      throw badRequest("Body must be valid JSON");
    }
  }

  validateAppRecordArray(parsed);
  await writeRecords(parsed);

  reply.code(204).send();
});

// ---- Serve React build ----
const webRoot = path.resolve("dist");
fastify.register(fastifyStatic, { root: webRoot });

// SPA fallback (React Router)
fastify.setNotFoundHandler(async (req, reply) => {
  if (req.url.startsWith("/api/")) return reply.code(404).send({ message: "Not found" });
  return reply.sendFile("index.html");
});

await fastify.listen({ port: PORT, host: "0.0.0.0" });
