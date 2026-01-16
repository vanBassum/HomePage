import type { AppRecord, CreateAppRecord } from "@/components/api"
import type { AppLink } from "@/components/models/AppLink"

export function recordToAppLink(r: AppRecord): AppLink {
  return {
    id: r.id,
    name: r.name,
    title: r.title,
    description: r.description,
    link: r.link,
    iconUrl: r.iconUrl,
    category: r.category,
    status: "unknown", // ← always synchronous
  }
}

export function appLinkToCreateRecord(
  a: Omit<AppLink, "id" | "status">
): CreateAppRecord {
  return {
    name: a.name,
    title: a.title,
    description: a.description,
    link: a.link,
    iconUrl: a.iconUrl,
    category: a.category,
  }
}

export function appLinkToRecord(
  a: Omit<AppLink, "status">
): AppRecord {
  return {
    id: a.id,
    name: a.name,
    title: a.title,
    description: a.description,
    link: a.link,
    iconUrl: a.iconUrl,
    category: a.category,
  }
}
