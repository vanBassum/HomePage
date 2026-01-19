// server/routes/appsRoutes.ts

import type { FastifyInstance } from "fastify";
import { parseAppRecord, isValidationError } from "homepage-shared";
import type { AppsRepo } from "../repos/appsRepo";
import { badRequest, notFound, parseId } from "../httpErrors";

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
    let app;
    try {
      app = parseAppRecord(req.body);
    } catch (err: unknown) {
      if (isValidationError(err)) {
        throw badRequest(err.message, { issues: err.issues });
      }
      throw err;
    }

    const created = repo.create(app);
    reply.code(201).send(created);
  });

  fastify.put("/api/apps/:id", async (req, reply) => {
    // @ts-expect-error Fastify param typing omitted for brevity
    const id = parseId(req.params?.id);

    let input;
    try {
      input = parseAppRecord(req.body);
    } catch (err: unknown) {
      if (isValidationError(err)) {
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
