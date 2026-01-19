import type { ValidationIssue } from "./types";

export class ValidationError extends Error {
  readonly issues: ValidationIssue[];

  constructor(message: string, issues: ValidationIssue[]) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

export function isValidationError(err: unknown): err is ValidationError {
  if (typeof err !== "object" || err === null) return false;

  const e = err as Record<string, unknown>;
  return e["isValidationError"] === true && Array.isArray(e["issues"]);
}
