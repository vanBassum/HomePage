import type { AppApiClient, CreateAppLink, UpdateAppLink } from "@/components/api/AppApiClient"
import type { AppLink } from "@/components/models/AppLink"
import { DUMMY_APPS } from "@/components/api/DummyData"

function newId() {
  return crypto?.randomUUID?.() ?? `tmp-${Math.random().toString(16).slice(2)}`
}

export class DummyAppApiClient implements AppApiClient {
  // in-memory store
  private items: AppLink[] = [...DUMMY_APPS]

  async getAll(): Promise<AppLink[]> {
    return [...this.items]
  }

  async getById(id: string): Promise<AppLink | null> {
    return this.items.find((x) => x.id === id) ?? null
  }

  async create(app: CreateAppLink): Promise<AppLink> {
    const created: AppLink = { ...app, id: newId() }
    this.items = [created, ...this.items]
    return created
  }

  async update(app: UpdateAppLink): Promise<AppLink> {
    const idx = this.items.findIndex((x) => x.id === app.id)
    if (idx === -1) {
      // Up to you: throw, or create. I prefer throw to surface bugs early.
      throw new Error(`AppLink not found: ${app.id}`)
    }
    const next = [...this.items]
    next[idx] = app
    this.items = next
    return app
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((x) => x.id !== id)
  }
}
