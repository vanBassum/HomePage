// validation/schema.ts
import { ValidationError, type ValidationIssue } from "./validationError";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype;
}

export type Validator<T> = (value: unknown, path: string) => T;

export function parseObjectCollecting<T extends Record<string, any>>(
  body: unknown,
  shape: { [K in keyof T]: Validator<T[K]> },
  basePath = ""
): T {
  if (!isPlainObject(body)) {
    throw new ValidationError("Invalid request body", [
      { path: basePath, message: "body must be an object" },
    ]);
  }

  const result: Partial<T> = {};
  const issues: ValidationIssue[] = [];

  for (const key in shape) {
    const path = basePath ? `${basePath}.${key}` : key;
    try {
      result[key] = shape[key]((body as Record<string, unknown>)[key], path);
    } catch (e) {
      if (e instanceof ValidationError) {
        issues.push(...e.issues);
      } else {
        issues.push({ path, message: "is invalid" });
      }
    }
  }

  if (issues.length > 0) {
    throw new ValidationError("Invalid request body", issues);
  }

  return result as T;
}
