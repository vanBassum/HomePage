import * as React from "react"
import type { AppLink } from "@/components/models/AppLink"
import { checkAppStatus } from "@/lib/utils"

export function useAppStatuses(apps: AppLink[]) {
  const [statuses, setStatuses] = React.useState<Record<string, AppLink["status"]>>({})

  React.useEffect(() => {
    let cancelled = false

    async function run() {
      for (const app of apps) {
        if (!app.link) continue

        const status = await checkAppStatus(app.link)
        if (cancelled) return

        setStatuses((prev) => {
          if (prev[app.id] === status) return prev
          return { ...prev, [app.id]: status }
        })
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [apps])

  return React.useMemo(
    () =>
      apps.map((a) => ({
        ...a,
        status: statuses[a.id] ?? a.status ?? "unknown",
      })),
    [apps, statuses]
  )
}
