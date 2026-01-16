import type { FastifyInstance } from "fastify";
import type { AppRecord } from "homepage-shared";
import type { CreateAppInput } from "../repos/appsRepo";
import { AppsRepo } from "../repos/appsRepo";

function badRequest(message: string) {
    const err: any = new Error(message);
    err.statusCode = 400;
    return err;
}

function notFound(message = "Not found") {
    const err: any = new Error(message);
    err.statusCode = 404;
    return err;
}

function parseId(idParam: unknown): number {
    const n = Number(idParam);
    if (!Number.isInteger(n) || n <= 0) throw badRequest("Invalid id");
    return n;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseCreateInput(body: unknown): CreateAppInput {
    if (!isPlainObject(body)) {
        throw badRequest("Body must be an object");
    }

    const name = body["name"];
    const description = body["description"];
    const link = body["link"];
    const iconUrl = body["iconUrl"];
    const category = body["category"];

    if (typeof name !== "string" || name.trim() === "") {
        throw badRequest("'name' must be a non-empty string");
    }
    if (typeof description !== "string" || description.trim() === "") {
        throw badRequest("'description' must be a non-empty string");
    }
    if (typeof link !== "string" || link.trim() === "") {
        throw badRequest("'link' must be a non-empty string");
    }

    if (iconUrl !== undefined && typeof iconUrl !== "string") {
        throw badRequest("'iconUrl' must be a string");
    }
    if (category !== undefined && typeof category !== "string") {
        throw badRequest("'category' must be a string");
    }

    return {
        name: name.trim(),
        description: description.trim(),
        link: link.trim(),
        iconUrl: iconUrl?.trim() || undefined,
        category: category?.trim() || undefined,
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
      const input = parseCreateInput(req.body);
  
      fastify.log.info({ input }, "POST /api/apps");
  
      const created = repo.create(input);
      fastify.log.info({ id: created.id }, "App created");
  
      reply.code(201).send(created);
    });
  
    fastify.put("/api/apps/:id", async (req, reply) => {
      // @ts-expect-error Fastify param typing omitted for brevity
      const id = parseId(req.params?.id);
      const input = parseCreateInput(req.body);
  
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
  