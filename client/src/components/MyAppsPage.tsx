import { useCallback, useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AppCard } from "@/components/AppCard"
import { NewAppCard } from "@/components/NewAppCard"
import { useMode } from "@/components/mode/mode-provider"
import { EditAppDialog } from "@/components/EditAppDialog"
import { ValidationError, type AppRecord, type ValidationIssue } from "homepage-shared"
import { toast } from "sonner"
import { useApi } from "@/api/useApi"
import type { CreateAppRequest } from "@/api/AppsApi"

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

function IssuesToast({ issues }: { issues: ValidationIssue[] }) {
  return (
    <div className="space-y-1">
      <div className="text-sm">Please fix the following:</div>
      <ul className="list-disc pl-5 text-sm">
        {issues.slice(0, 6).map((i, idx) => (
          <li key={idx}>
            <span className="font-medium">{i.path || "(body)"}:</span> {i.message}
          </li>
        ))}
        {issues.length > 6 && <li>…plus {issues.length - 6} more</li>}
      </ul>
    </div>
  )
}

function toErrorMessage(e: unknown, fallback: string) {
  if (e instanceof Error) return e.message || fallback
  const s = String(e)
  return s && s !== "[object Object]" ? s : fallback
}

export function MyAppsPage() {
  const api = useApi()
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
        a.link.toLowerCase().includes(q)
      )
    })
  }, [apps, query])

  const showExceptionAsToast = useCallback((e: unknown, fallback: string) => {
    if (e instanceof ValidationError) {
      toast.error("Invalid input", {
        description: <IssuesToast issues={e.issues} />,
      })
      return
    }

    toast.error(toErrorMessage(e, fallback))
  }, [])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setLoading(true)
      try {
        const data = await api.apps.getAll()
        if (!cancelled) setApps(data)
      } catch (e) {
        if (!cancelled) showExceptionAsToast(e, "Failed to load apps")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [api, showExceptionAsToast])

  const handleEdit = (app: AppRecord) => {
    setEditing(app)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    const blank: AppRecord = {
      id: 0,
      name: "",
      description: "",
      link: "",
      iconUrl: undefined,
      category: "",
    }
    setEditing(blank)
    setDialogOpen(true)
  }

  const handleSave = useCallback(
    async (next: AppRecord) => {
      try {
        if (!next.id) {
          const { id: _id, ...payload } = next
          const created = await api.apps.create(payload as CreateAppRequest)
          setApps((prev) => [created, ...prev])
          toast.success("App created")
        } else {
          const { id, ...payload } = next
          await api.apps.update(id, payload)
          setApps((prev) => prev.map((x) => (x.id === id ? next : x)))
          toast.success("App saved")
        }

        setDialogOpen(false)
        setEditing(null)
      } catch (e) {
        showExceptionAsToast(e, "Failed to save app")
        throw e
      }
    },
    [api, showExceptionAsToast]
  )

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await api.apps.delete(id)
        setApps((prev) => prev.filter((x) => x.id !== id))
        toast.success("App deleted")

        if (editing?.id === id) {
          setDialogOpen(false)
          setEditing(null)
        }
      } catch (e) {
        showExceptionAsToast(e, "Failed to delete app")
        throw e
      }
    },
    [api, editing?.id, showExceptionAsToast]
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
