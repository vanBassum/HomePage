import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AppRecord } from "homepage-shared"

type EditAppFormProps = {
  app: AppRecord
  onChange?: (next: AppRecord) => void
}

export function EditAppForm({ app, onChange }: EditAppFormProps) {
  const [draft, setDraft] = React.useState<AppRecord>(app)

  // Keep draft in sync when a different app is selected for editing
  React.useEffect(() => {
    setDraft(app)
  }, [app])

  // Helper: update draft and notify parent (optional)
  const update = (patch: Partial<AppRecord>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch }
      onChange?.(next)
      return next
    })
  }

  return (
    <div className="grid gap-6 py-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="app-name">Name</Label>
          <Input
            id="app-name"
            value={draft.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="e.g. Grafana"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="app-category">Category</Label>
          <Input
            id="app-category"
            value={draft.category ?? ""}
            onChange={(e) => update({ category: e.target.value })}
            placeholder="e.g. Monitoring"
          />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="app-link">Link</Label>
          <Input
            id="app-link"
            value={draft.link}
            onChange={(e) => update({ link: e.target.value })}
            placeholder="https://..."
            inputMode="url"
          />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="app-icon">Icon URL</Label>
          <Input
            id="app-icon"
            value={draft.iconUrl ?? ""}
            onChange={(e) => update({ iconUrl: e.target.value })}
            placeholder="https://... (optional)"
            inputMode="url"
          />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="app-description">Description</Label>
          <Textarea
            id="app-description"
            value={draft.description ?? ""}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Short description shown on the card…"
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
