import * as React from "react"
import type { AppLink } from "@/components/models/AppLink"
import { appApiClient } from "@/components/api"
import type { CreateAppLink } from "@/components/api"

export function useApps() {
  const [items, setItems] = React.useState<AppLink[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<unknown>(null)

  const reload = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const all = await appApiClient.getAll()
      setItems(all)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void reload()
  }, [reload])

  const create = React.useCallback(async (app: CreateAppLink) => {
    const created = await appApiClient.create(app)
    setItems((prev) => [created, ...prev])
    return created
  }, [])

  const update = React.useCallback(async (app: AppLink) => {
    const updated = await appApiClient.update(app)
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === updated.id)
      if (idx === -1) return [updated, ...prev]
      const copy = [...prev]
      copy[idx] = updated
      return copy
    })
    return updated
  }, [])

  const remove = React.useCallback(async (id: string) => {
    await appApiClient.delete(id)
    setItems((prev) => prev.filter((x) => x.id !== id))
  }, [])

  return { items, loading, error, reload, create, update, remove }
}
