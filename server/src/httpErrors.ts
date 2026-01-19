export function badRequest(message: string, details?: unknown) {
  const err: any = new Error(message);
  err.statusCode = 400;
  if (details !== undefined) err.details = details;
  return err;
}

export function notFound(message = "Not found") {
  const err: any = new Error(message);
  err.statusCode = 404;
  return err;
}

export function parseId(idParam: unknown): number {
  const n = Number(idParam);
  if (!Number.isInteger(n) || n <= 0) throw badRequest("Invalid id");
  return n;
}
