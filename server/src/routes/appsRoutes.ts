// server/routes/appsRoutes.ts

import type { FastifyInstance } from "fastify";
import { ValidationError, validateObject, appRecordSchema, type AppRecord } from "homepage-shared";
import type { AppsRepo } from "../repos/appsRepo";
import { badRequest, notFound, parseId } from "../httpErrors";

/**
 * Parse unknown request body into an AppRecord create/update payload.
 * Transport concerns stay here; validation rules stay shared.
 */
function parseAppRecordBody(body: unknown): Omit<AppRecord, "id"> {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new ValidationError("Invalid request body", [
      { path: "", message: "body must be an object" },
    ]);
  }

  const o = body as Record<string, unknown>;

  const trim = (v: unknown): string | undefined => {
    if (typeof v !== "string") return undefined;
    const s = v.trim();
    return s === "" ? undefined : s;
  };

  // Required fields: keep empty string so validators can report “not blank”
  return {
    name: typeof o.name === "string" ? o.name : "",
    link: typeof o.link === "string" ? o.link : "",
    description: trim(o.description),
    iconUrl: trim(o.iconUrl),
    category: trim(o.category),
  };
}

export async function registerAppsRoutes(
  fastify: FastifyInstance,
  repo: AppsRepo
) {
  fastify.get("/api/apps", async (_req, reply) => {
    const apps = repo.getAll();
    fastify.log.info({ count: apps.length }, "GET /api/apps");
    reply.send(apps);
  });

  fastify.get("/api/apps/:id", async (req, reply) => {
    // @ts-expect-error Fastify param typing omitted for brevity
    const id = parseId(req.params?.id);

    fastify.log.info({ id }, "GET /api/apps/:id");

    const app = repo.getById(id);
    if (!app) {
      fastify.log.warn({ id }, "App not found");
      throw notFound();
    }

    reply.send(app);
  });

  fastify.post("/api/apps", async (req, reply) => {
    let input: Omit<AppRecord, "id">;

    try {
      input = parseAppRecordBody(req.body);
      validateObject(appRecordSchema, input);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        throw badRequest(err.message, { issues: err.issues });
      }
      throw err;
    }

    const created = repo.create(input);
    reply.code(201).send(created);
  });

  fastify.put("/api/apps/:id", async (req, reply) => {
    // @ts-expect-error Fastify param typing omitted for brevity
    const id = parseId(req.params?.id);

    let input: Omit<AppRecord, "id">;

    try {
      input = parseAppRecordBody(req.body);
      validateObject(appRecordSchema, input);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        throw badRequest(err.message, { issues: err.issues });
      }
      throw err;
    }

    fastify.log.info({ id, input }, "PUT /api/apps/:id");

    const ok = repo.update(id, input);
    if (!ok) {
      fastify.log.warn({ id }, "App not found");
      throw notFound();
    }

    reply.code(204).send();
  });

  fastify.delete("/api/apps/:id", async (req, reply) => {
    // @ts-expect-error Fastify param typing omitted for brevity
    const id = parseId(req.params?.id);

    fastify.log.info({ id }, "DELETE /api/apps/:id");

    const ok = repo.delete(id);
    if (!ok) {
      fastify.log.warn({ id }, "App not found");
      throw notFound();
    }

    reply.code(204).send();
  });
}
