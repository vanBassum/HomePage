import type { Schema, ValidationIssue } from "./types";
import { ValidationError } from "./validationError";

export function validateObject<T extends Record<string, any>>(
  schema: Schema<T>,
  obj: T,
  message = "Invalid request body"
): void {
  const issues: ValidationIssue[] = [];

  for (const key in schema) {
    const validators = schema[key];
    if (!validators || validators.length === 0) continue;

    const value = obj[key];
    for (const v of validators) {
      const err = v(value);
      if (err) issues.push({ path: key, message: err });
    }
  }

  if (issues.length) {
    throw new ValidationError(message, issues);
  }
}

export function validateField<T extends Record<string, any>, K extends keyof T>(
  schema: Schema<T>,
  key: K,
  value: unknown
): ValidationIssue[] {
  const validators = schema[key];
  if (!validators || validators.length === 0) return [];

  const issues: ValidationIssue[] = [];
  for (const v of validators) {
    const err = v(value);
    if (err) issues.push({ path: String(key), message: err });
  }

  return issues;
}
