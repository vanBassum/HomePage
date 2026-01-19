import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AppRecord, ValidationIssue } from "homepage-shared"
import { validateObject } from "homepage-shared"
import { appRecordSchema } from "homepage-shared"

type EditAppFormProps = {
  app: AppRecord
  onChange?: (next: AppRecord) => void
}

type FieldErrors = Partial<Record<keyof AppRecord, string[]>>

function issuesToFieldErrors(issues: ValidationIssue[]): FieldErrors {
  const map: FieldErrors = {}

  for (const i of issues) {
    const key = i.path as keyof AppRecord
    if (!key) continue
    ;(map[key] ??= []).push(i.message)
  }

  return map
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null
  return <div className="text-sm text-destructive">{messages[0]}</div>
}

function validateDraft(draft: AppRecord): FieldErrors {
  try {
    // Validate the create/update payload (no id)
    const { id: _id, ...payload } = draft
    validateObject(appRecordSchema as any, payload as any)
    return {}
  } catch (e: unknown) {
    // We keep the UI code independent of the error class here:
    // validateObject throws ValidationError with `.issues`.
    if (typeof e === "object" && e !== null && "issues" in e && Array.isArray((e as any).issues)) {
      return issuesToFieldErrors((e as any).issues as ValidationIssue[])
    }
    return {}
  }
}

export function EditAppForm({ app, onChange }: EditAppFormProps) {
  const [draft, setDraft] = React.useState<AppRecord>(app)
  const [errors, setErrors] = React.useState<FieldErrors>({})

  React.useEffect(() => {
    setDraft(app)
  }, [app])

  React.useEffect(() => {
    setErrors(validateDraft(draft))
  }, [draft])

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
            aria-invalid={!!errors.name?.length}
          />
          <FieldError messages={errors.name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="app-category">Category</Label>
          <Input
            id="app-category"
            value={draft.category ?? ""}
            onChange={(e) => update({ category: e.target.value })}
            placeholder="e.g. Monitoring"
            aria-invalid={!!errors.category?.length}
          />
          <FieldError messages={errors.category} />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="app-link">Link</Label>
          <Input
            id="app-link"
            value={draft.link}
            onChange={(e) => update({ link: e.target.value })}
            placeholder="https://example.com"
            inputMode="url"
            aria-invalid={!!errors.link?.length}
          />
          <FieldError messages={errors.link} />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="app-icon">Icon URL</Label>
          <Input
            id="app-icon"
            value={draft.iconUrl ?? ""}
            onChange={(e) => update({ iconUrl: e.target.value })}
            placeholder="https://cdn.simpleicons.org/example"
            inputMode="url"
            aria-invalid={!!errors.iconUrl?.length}
          />
          <FieldError messages={errors.iconUrl} />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="app-description">Description</Label>
          <Textarea
            id="app-description"
            value={draft.description ?? ""}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Short description shown on the card…"
            rows={3}
            aria-invalid={!!errors.description?.length}
          />
          <FieldError messages={errors.description} />
        </div>
      </div>
    </div>
  )
}
