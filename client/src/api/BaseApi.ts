// src/api/BaseApi.ts
import { ValidationError, type ValidationIssue } from "homepage-shared";

export type ApiOptions = {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
};

type ApiErrorBody = {
  message?: string;
  issues?: ValidationIssue[];
  // allow legacy / alternate shapes
  details?: { issues?: ValidationIssue[] };
};

export class BaseApi {
  protected readonly baseUrl: string;
  protected readonly fetchImpl: typeof fetch;

  public constructor(opts?: ApiOptions) {
    this.baseUrl = opts?.baseUrl ?? "";

    // ensure fetch has a safe invocation context
    const defaultFetch = globalThis.fetch?.bind(globalThis);
    this.fetchImpl = opts?.fetchImpl ?? (defaultFetch as typeof fetch);
    if (!this.fetchImpl) {
      throw new Error("No fetch implementation available.");
    }
  }

  protected url(p: string): string {
    const base = this.baseUrl.replace(/\/+$/, "");
    const path = p.startsWith("/") ? p : `/${p}`;
    return `${base}${path}`;
  }

  protected async readJson<T>(res: Response, expected: string): Promise<T> {
    const data: unknown = await res.json();
    if (data === null || data === undefined) {
      throw new Error(`Invalid server response: expected ${expected}`);
    }
    return data as T;
  }

  protected async toError(res: Response, fallbackMessage: string): Promise<Error> {
    const contentType = res.headers.get("content-type") ?? "";
    let body: unknown = undefined;

    // Try to parse response body once
    try {
      if (contentType.includes("application/json")) {
        body = await res.json();
      } else {
        const text = await res.text();
        body = text ? { message: text } : undefined;
      }
    } catch {
      body = undefined;
    }

    // If server provided field issues -> throw shared ValidationError
    if (body && typeof body === "object") {
      const b = body as ApiErrorBody;

      const issues =
        Array.isArray(b.issues)
          ? b.issues
          : Array.isArray(b.details?.issues)
            ? b.details.issues
            : undefined;

      if (issues && issues.length > 0) {
        const msg = typeof b.message === "string" && b.message.trim()
          ? b.message
          : "Invalid request body";
        return new ValidationError(msg, issues);
      }

      // If server provided a message, use it (do not stringify full body into the message)
      if (typeof b.message === "string" && b.message.trim()) {
        const err = new Error(b.message);
        (err as any).statusCode = res.status;
        (err as any).body = body;
        return err;
      }
    }

    // Fallback message
    const err = new Error(`${fallbackMessage} (HTTP ${res.status})`);
    (err as any).statusCode = res.status;
    (err as any).body = body;
    return err;
  }
}
