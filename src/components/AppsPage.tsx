import { useMemo, useState } from "react"
import type { AppLink } from "@/components/models/AppLink"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AppCard } from "@/components/AppCard"
import { NewAppCard } from "@/components/NewAppCard"
import { useMode } from "@/components/mode/mode-provider"



type HeaderBarProps = {
  query: string
  setQuery: (q: string) => void
  filtered: AppLink[]
  apps: AppLink[]
  category: string
  setCategory: (c: string) => void
  categories: string[]
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


type AppPageProps = {
  apps: AppLink[]
}

export function MyAppsPage({ apps }: AppPageProps) {
  const { mode } = useMode()   // ← consume mode

  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("All")

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const a of apps) if (a.category) set.add(a.category)
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [apps])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return apps.filter((a) => {
      const matchCategory = category === "All" ? true : a.category === category
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.link.toLowerCase().includes(q)
      return matchCategory && matchQuery
    })
  }, [apps, query, category])

  return (
    <div className="flex h-full flex-col">
      <HeaderBar
        query={query}
        setQuery={setQuery}
        filtered={filtered}
        apps={apps}
        category={category}
        setCategory={setCategory}
        categories={categories}
      />

      <ScrollArea className="flex-1">
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}

            {mode === "edit" && (
              <NewAppCard onCreate={() => alert("Create new app")} />
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

