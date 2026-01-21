// src/api/AppsApi.ts
import type { AppRecord } from "homepage-shared";
import { BaseApi } from "./BaseApi";

export type CreateAppRequest = Omit<AppRecord, "id">;

export class AppsApi extends BaseApi {
  public async getAll(): Promise<AppRecord[]> {
    const res = await this.fetchImpl(this.url("/api/apps"), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) throw await this.toError(res, "Failed to load apps");

    const data = await this.readJson<unknown>(res, "an array");
    if (!Array.isArray(data)) {
      throw new Error("Invalid server response: expected an array");
    }

    return data as AppRecord[];
  }

  public async get(id: number): Promise<AppRecord> {
    const res = await this.fetchImpl(this.url(`/api/apps/${id}`), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) throw await this.toError(res, "Failed to load app");

    const data = await this.readJson<unknown>(res, "an object");
    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid server response: expected an object");
    }

    return data as AppRecord;
  }

  public async create(input: CreateAppRequest): Promise<AppRecord> {
    const res = await this.fetchImpl(this.url("/api/apps"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) throw await this.toError(res, "Failed to create app");

    const data = await this.readJson<unknown>(res, "an object");
    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid server response: expected an object");
    }

    return data as AppRecord;
  }

  public async update(id: number, input: CreateAppRequest): Promise<void> {
    const res = await this.fetchImpl(this.url(`/api/apps/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) throw await this.toError(res, "Failed to update app");
  }

  public async delete(id: number): Promise<void> {
    const res = await this.fetchImpl(this.url(`/api/apps/${id}`), {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw await this.toError(res, "Failed to delete app");
  }
}
