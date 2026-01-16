import type { AppApiClient, CreateAppRecord, UpdateAppRecord } from "@/components/api/AppApiClient"
import type { AppRecord } from "@/components/api/models/AppRecord"
import { pb } from "@/components/api/pocketbase/pb"

const COLLECTION = "apps"

// PocketBase returns records that include id, created, updated, etc.
// We only pick the fields we care about into AppRecord.
function toAppRecord(r: any): AppRecord {
  return {
    id: String(r.id),
    name: r.name ?? "",
    title: r.title ?? "",
    description: r.description ?? "",
    link: r.link ?? "",
    iconUrl: r.iconUrl ?? undefined,
    category: r.category ?? undefined,
  }
}

export class PocketBaseAppApiClient implements AppApiClient {
  async getAll(): Promise<AppRecord[]> {
    const list = await pb.collection(COLLECTION).getFullList({
      sort: "-created",
    })
    return list.map(toAppRecord)
  }

  async getById(id: string): Promise<AppRecord | null> {
    try {
      const one = await pb.collection(COLLECTION).getOne(id)
      return toAppRecord(one)
    } catch {
      return null
    }
  }

  async create(record: CreateAppRecord): Promise<AppRecord> {
    const created = await pb.collection(COLLECTION).create({
      name: record.name,
      title: record.title,
      description: record.description,
      link: record.link,
      iconUrl: record.iconUrl ?? null,
      category: record.category ?? null,
    })
    return toAppRecord(created)
  }

  async update(record: UpdateAppRecord): Promise<AppRecord> {
    const updated = await pb.collection(COLLECTION).update(record.id, {
      name: record.name,
      title: record.title,
      description: record.description,
      link: record.link,
      iconUrl: record.iconUrl ?? null,
      category: record.category ?? null,
    })
    return toAppRecord(updated)
  }

  async delete(id: string): Promise<void> {
    await pb.collection(COLLECTION).delete(id)
  }
}
