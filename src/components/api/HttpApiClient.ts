import type { ApiClient } from "./ApiClient";
import type { AppRecord } from "../../../shared/models/AppRecord";

export class HttpApiClient implements ApiClient {
  public constructor(
    private readonly baseUrl: string = "",
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  public async GetAll(): Promise<AppRecord[]> {
    const res = await this.fetchImpl(this.url("/api/apps"), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw await this.toError(res, "Failed to load apps");

    const data: unknown = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid server response: expected an array");
    }

    // Option B: trust shape; server will do basic checks
    return data as AppRecord[];
  }

  public async WriteAll(records: AppRecord[]): Promise<void> {
    const res = await this.fetchImpl(this.url("/api/apps"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(records),
    });

    if (!res.ok) throw await this.toError(res, "Failed to save apps");
  }

  private url(path: string): string {
    const base = this.baseUrl.replace(/\/+$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${base}${p}`;
  }

  private async toError(res: Response, fallbackMessage: string): Promise<Error> {
    const contentType = res.headers.get("content-type") ?? "";
    let details = "";

    try {
      if (contentType.includes("application/json")) {
        const j = (await res.json()) as any;
        details = typeof j?.message === "string" ? j.message : JSON.stringify(j);
      } else {
        details = await res.text();
      }
    } catch {
      // ignore
    }

    const message = details
      ? `${fallbackMessage}: ${details}`
      : `${fallbackMessage} (HTTP ${res.status})`;

    return new Error(message);
  }
}
