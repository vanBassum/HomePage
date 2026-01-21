import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EditAppForm } from "@/components/EditAppForm"
import type { AppRecord } from "@/api"

type EditAppDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void

  value: AppRecord
  onSave: (next: AppRecord) => void
  onDelete?: (id: number) => void
}

export function EditAppDialog({ open, onOpenChange, value, onSave, onDelete }: EditAppDialogProps) {
  const [draft, setDraft] = React.useState<AppRecord>(value)

  React.useEffect(() => {
    if (!open) return
    setDraft(value)
  }, [open, value])

  const isNew = !value.id
  const dialogTitle = isNew ? "New" : (value.name?.trim() ? value.name : "Untitled")

  const commit = () => {
    // Minimal validation; expand as needed
    if (!draft?.name?.trim()) return
    if (!draft?.url?.trim()) return

    const cleaned: AppRecord = {
      ...draft,
      name: draft.name.trim(),
      description: draft.description?.trim() ?? "",
      url: draft.url.trim(),
      iconUrl: draft.iconUrl?.trim() ?? null,
      category: draft.category?.trim() ?? null,
    }

    onSave(cleaned)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <EditAppForm app={draft} onChange={setDraft} />

        <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between">
          {onDelete && !isNew ? (
            <Button
              variant="destructive"
              onClick={() => {
                if (value.id === undefined) return;
                onDelete(value.id)
                onOpenChange(false)
              }}
            >
              Delete
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={commit}>{isNew ? "Create" : "Save"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
