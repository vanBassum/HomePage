import type { AppRecord } from "../../../shared/models/AppRecord";

export interface ApiClient {
  GetAll(): Promise<AppRecord[]>;
  WriteAll(records: AppRecord[]): Promise<void>;
}
