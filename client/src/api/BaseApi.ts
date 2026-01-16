// src/api/BaseApi.ts
export type ApiOptions = {
    baseUrl?: string;
    fetchImpl?: typeof fetch;
};

export class BaseApi {
    protected readonly baseUrl: string;
    protected readonly fetchImpl: typeof fetch;

    public constructor(opts?: ApiOptions) {
        this.baseUrl = opts?.baseUrl ?? "";

        // Fix: ensure fetch has a safe invocation context
        // - browsers: bind(window) works
        // - SSR / Node 18+: bind(globalThis) works
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
        // Keep checks minimal; server authoritative. Only validate shape where critical.
        if (data === null || data === undefined) {
            throw new Error(`Invalid server response: expected ${expected}`);
        }
        return data as T;
    }

    protected async toError(res: Response, fallbackMessage: string): Promise<Error> {
        const contentType = res.headers.get("content-type") ?? "";
        let details = "";

        try {
            if (contentType.includes("application/json")) {
                const j: unknown = await res.json();
                if (
                    typeof j === "object" &&
                    j !== null &&
                    "message" in j &&
                    typeof (j as any).message === "string"
                ) {
                    details = (j as any).message;
                } else {
                    details = JSON.stringify(j);
                }
            } else {
                details = await res.text();
            }
        } catch {
            // ignore parse errors
        }

        const message = details
            ? `${fallbackMessage}: ${details}`
            : `${fallbackMessage} (HTTP ${res.status})`;

        return new Error(message);
    }
}
