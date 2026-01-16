import type { AppLink } from "@/components/models/AppLink"
import { Signal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { openUrl } from "@/lib/utils"
import { useMode } from "@/components/mode/mode-provider"
import { ClickableCard } from "@/components/ClickableCard"

function statusBadgeVariant(status: AppLink["status"]) {
  switch (status) {
    case "online":
      return { text: "Online", className: "bg-emerald-600 text-white" }
    case "offline":
      return { text: "Offline", className: "bg-rose-600 text-white" }
    default:
      return { text: "Checking", className: "bg-muted text-foreground" }
  }
}

function AppLogo({ app }: { app: AppLink }) {
  return (
    <img
      src={app.iconUrl ?? "https://cdn.simpleicons.org/linktree"}
      alt={app.title}
      className="h-full w-full object-contain p-2"
      onError={(ev) => {
        const img = ev.currentTarget
        try {
          const u = new URL(app.link)
          img.src = `${u.protocol}//${u.host}/favicon.ico`
        } catch {
          img.src = "https://cdn.simpleicons.org/link"
        }
      }}
    />
  )
}

type AppCardProps = {
  app: AppLink
  onEdit?: (app: AppLink) => void
}

export function AppCard({ app, onEdit }: AppCardProps) {
  const badge = statusBadgeVariant(app.status)
  const { mode } = useMode()
  const isEdit = mode === "edit"

  const onActivate = () => {
    if (isEdit) onEdit?.(app)
    else openUrl(app.link)
  }

  return (
    <ClickableCard onActivate={onActivate}>
      <CardHeader className="pb-2 h-full">
        <div className="flex items-start gap-3">
          <div
            className={[
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border bg-background",
              isEdit ? "border-blue-500/40" : "",
            ].join(" ")}
          >
            <AppLogo app={app} />
          </div>

          <div className="min-w-0 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="min-w-0 truncate text-base">
                {app.title}
              </CardTitle>

              <Badge
                className={
                  "shrink-0 transition-colors " +
                  badge.className +
                  (isEdit ? " opacity-60 saturate-50" : "")
                }
              >
                <span className="inline-flex items-center gap-1">
                  <Signal className="h-3.5 w-3.5" />
                  {badge.text}
                </span>
              </Badge>
            </div>

            <CardDescription className="mt-1 line-clamp-2">
              {app.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </ClickableCard>
  )
}
