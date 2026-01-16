import { useMemo, useState } from "react"
import type { AppLink } from "@/components/models/AppLink"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AppCard } from "@/components/AppCard"
import { NewAppCard } from "@/components/NewAppCard"
import { useMode } from "@/components/mode/mode-provider"
import { EditAppDialog } from "@/components/EditAppDialog"
import { useApps } from "./apps/useApps"

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
  const { items: apps, loading, create, update, remove } = useApps()

  const [query, setQuery] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AppLink | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return apps.filter((a) => {
      return (
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.description ?? "").toLowerCase().includes(q) ||
        a.link.toLowerCase().includes(q)
      )
    })
  }, [apps, query])

  const handleEdit = (app: AppLink) => {
    setEditing(app)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    const blank: AppLink = {
      id: "", // empty => "New" in dialog
      name: "",
      title: "",
      description: "",
      link: "",
      iconUrl: undefined,
      buttons: [],
      status: "unknown",
      category: "",
    }
    setEditing(blank)
    setDialogOpen(true)
  }

  const handleSave = async (next: AppLink) => {
    if (!next.id) {
      // create expects Omit<AppLink,"id"> (CreateAppLink)
      const { id: _id, ...payload } = next
      await create(payload)
    } else {
      await update(next)
    }
  }

  const handleDelete = async (id: string) => {
    await remove(id)
  }

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