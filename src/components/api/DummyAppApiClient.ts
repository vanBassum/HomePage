import type { AppApiClient, CreateAppRecord, UpdateAppRecord } from "@/components/api/AppApiClient"
import type { AppRecord } from "@/components/api/models/AppRecord"
import { DUMMY_APPS } from "@/components/api/DummyData"

function newId() {
  return crypto?.randomUUID?.() ?? `tmp-${Math.random().toString(16).slice(2)}`
}

export class DummyAppApiClient implements AppApiClient {
  private items: AppRecord[] = [...DUMMY_APPS]

  async getAll(): Promise<AppRecord[]> {
    return [...this.items]
  }

  async getById(id: string): Promise<AppRecord | null> {
    return this.items.find((x) => x.id === id) ?? null
  }

  async create(record: CreateAppRecord): Promise<AppRecord> {
    const created: AppRecord = { ...record, id: newId() }
    this.items = [created, ...this.items]
    return created
  }

  async update(record: UpdateAppRecord): Promise<AppRecord> {
    const idx = this.items.findIndex((x) => x.id === record.id)
    if (idx === -1) throw new Error(`Record not found: ${record.id}`)
    const next = [...this.items]
    next[idx] = record
    this.items = next
    return record
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((x) => x.id !== id)
  }
}
