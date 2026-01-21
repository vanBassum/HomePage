import { useCallback, useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AppCard } from "@/components/AppCard"
import { NewAppCard } from "@/components/NewAppCard"
import { useMode } from "@/components/mode/mode-provider"
import { EditAppDialog } from "@/components/EditAppDialog"
import { toast } from "sonner"
import { api, type AppRecord } from "@/api"

type HeaderBarProps = {
  query: string
  setQuery: (q: string) => void
}

function HeaderBar({ query, setQuery }: HeaderBarProps) {
  return (
    <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">My apps</h1>
            <p className="text-sm text-muted-foreground">Quick links and status at a glance</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search apps…"
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MyAppsPage() {
  const { mode } = useMode()

  const [apps, setApps] = useState<AppRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AppRecord | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return apps.filter((a) => {
      return (
        !q ||
        a.name.toLowerCase().includes(q) ||
        (a.description ?? "").toLowerCase().includes(q) ||
        (a.url ?? "").toLowerCase().includes(q)
      )
    })
  }, [apps, query])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setLoading(true)
      try {
        const res = await api.apps.apiAppsGet()
        if (!cancelled) setApps(res.data)
      } catch {
        if (!cancelled) toast.error("Failed to load applications")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const handleEdit = (app: AppRecord) => {
    setEditing(app)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    const blank: AppRecord = {
      id: 0,
      name: "New app",
      description: null,
      url: null,
      iconUrl: null,
      category: null,
    }
    setEditing(blank)
    setDialogOpen(true)
  }

  const handleSave = useCallback(
    async (next: AppRecord) => {
      try {
        if (!next.id) {
          const { id: _id, ...payload } = next
          const created = await api.apps.apiAppsPost(payload as any)
          setApps((prev) => [created.data, ...prev])
          toast.success("App created")
        } else {
          const { id, ...payload } = next

          // Most TS OpenAPI generators name PUT /api/apps/{id} as apiAppsIdPut
          // (rather than apiAppsPut). This matches the earlier error pattern.
          await api.apps.apiAppsIdPut(id, payload as any)

          // Prefer server echo if available; otherwise, keep local `next`
          setApps((prev) => prev.map((x) => (x.id === id ? next : x)))
          toast.success("App saved")
        }

        setDialogOpen(false)
        setEditing(null)
      } catch (e) {
        toast.error("Failed to save app")
        throw e
      }
    },
    []
  )

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await api.apps.apiAppsIdDelete(id)
        setApps((prev) => prev.filter((x) => x.id !== id))
        toast.success("App deleted")

        if (editing?.id === id) {
          setDialogOpen(false)
          setEditing(null)
        }
      } catch (e) {
        toast.error("Failed to delete app")
        throw e
      }
    },
    [editing?.id]
  )

  return (
    <div className="flex h-full flex-col">
      <HeaderBar query={query} setQuery={setQuery} />

      {loading ? (
        <div className="p-6 text-sm text-muted-foreground">Loading applications…</div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((app) => (
                <AppCard key={app.id} app={app} onEdit={handleEdit} />
              ))}

              {mode === "edit" && <NewAppCard onCreate={handleCreate} />}
            </div>
          </div>
        </ScrollArea>
      )}

      {editing && (
        <EditAppDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) setEditing(null)
          }}
          value={editing}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
