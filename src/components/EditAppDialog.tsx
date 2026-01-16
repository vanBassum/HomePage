import * as React from "react"
import type { AppLink } from "@/components/models/AppLink"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EditAppForm } from "@/components/EditAppForm"

type EditAppDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void

  value: AppLink
  onSave: (next: AppLink) => void
  onDelete?: (id: string) => void
}

export function EditAppDialog({ open, onOpenChange, value, onSave, onDelete }: EditAppDialogProps) {
  const [draft, setDraft] = React.useState<AppLink>(value)

  React.useEffect(() => {
    if (!open) return
    setDraft(value)
  }, [open, value])

  const isNew = !value.id
  const dialogTitle = isNew ? "New" : (value.title?.trim() ? value.title : "Untitled")

  const commit = () => {
    // Minimal validation; expand as needed
    if (!draft.title.trim()) return
    if (!draft.link.trim()) return

    const cleaned: AppLink = {
      ...draft,
      title: draft.title.trim(),
      description: draft.description?.trim() ?? "",
      link: draft.link.trim(),
      iconUrl: draft.iconUrl?.trim() || undefined,
      category: draft.category?.trim() || undefined,
      buttons: draft.buttons?.filter((b) => b.label.trim() || b.url.trim()),
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
