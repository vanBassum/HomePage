// src/api/ApiClient.ts
import type { ApiOptions } from "./BaseApi";
import { AppsApi } from "./AppsApi";

export class ApiClient {
  public readonly apps: AppsApi;

  public constructor(opts?: ApiOptions) {
    this.apps = new AppsApi(opts);
  }
}
