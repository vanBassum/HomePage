import type { AppRecord } from "@/components/api/models/AppRecord"

export type CreateAppRecord = Omit<AppRecord, "id">
export type UpdateAppRecord = AppRecord

export interface AppApiClient {
  getAll(): Promise<AppRecord[]>
  getById(id: string): Promise<AppRecord | null>
  create(record: CreateAppRecord): Promise<AppRecord>
  update(record: UpdateAppRecord): Promise<AppRecord>
  delete(id: string): Promise<void>
}
