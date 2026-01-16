import * as React from "react"
import { appApiClient, type AppRecord, type CreateAppRecord } from "@/components/api"
import type { AppLink } from "@/components/models/AppLink"
import { appLinkToCreateRecord, appLinkToRecord, recordToAppLink } from "@/components/apps/appMapper"

export function useApps() {
  const [records, setRecords] = React.useState<AppRecord[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<unknown>(null)

  const reload = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const all = await appApiClient.getAll()
      setRecords(all)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void reload()
  }, [reload])

  // UI-facing items
  const items = React.useMemo<AppLink[]>(
    () => records.map(recordToAppLink),
    [records]
  )

  // Create from UI model (ignore id/status)
  const create = React.useCallback(
    async (app: Omit<AppLink, "id" | "status">) => {
      const payload: CreateAppRecord = appLinkToCreateRecord(app)
      const created = await appApiClient.create(payload)
      setRecords((prev) => [created, ...prev])
      return recordToAppLink(created)
    },
    []
  )

  // Update from UI model (ignore status)
  const update = React.useCallback(
    async (app: Omit<AppLink, "status">) => {
      const payload = appLinkToRecord(app)
      const updated = await appApiClient.update(payload)
      setRecords((prev) => {
        const idx = prev.findIndex((x) => x.id === updated.id)
        if (idx === -1) return [updated, ...prev]
        const copy = [...prev]
        copy[idx] = updated
        return copy
      })
      return recordToAppLink(updated)
    },
    []
  )

  const remove = React.useCallback(async (id: string) => {
    await appApiClient.delete(id)
    setRecords((prev) => prev.filter((x) => x.id !== id))
  }, [])

  return { items, loading, error, reload, create, update, remove }
}
