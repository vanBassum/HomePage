import { Plus } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { ClickableCard } from "@/components/ClickableCard"

type NewAppCardProps = {
  onCreate: () => void
}

export function NewAppCard({ onCreate }: NewAppCardProps) {
  return (
    <ClickableCard
      onActivate={onCreate}
      // keep its distinct “create” affordance, but it still inherits edit-mode styling
      viewClassName="border-dashed hover:border-primary"
      editClassName="border-dashed hover:border-primary"
    >
      <CardContent className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-primary">
          <Plus className="h-8 w-8" />
          <span className="text-sm font-medium">Add new app</span>
        </div>
      </CardContent>
    </ClickableCard>
  )
}
