import * as React from "react"
import { Card } from "@/components/ui/card"
import { useMode } from "@/components/mode/mode-provider"

type ClickableCardProps = {
  children: React.ReactNode
  onActivate: () => void
  className?: string
  editClassName?: string
  viewClassName?: string
}

export function ClickableCard({
  children,
  onActivate,
  className,
  editClassName,
  viewClassName,
}: ClickableCardProps) {
  const { mode } = useMode()
  const isEdit = mode === "edit"

  const base =
    "group h-28 overflow-hidden transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"

  const modeClass = isEdit
    ? [
        "hover:shadow-lg",
        // shared “edit mode” affordance
        "border-dashed ring-1 ring-blue-500/30 bg-blue-500/5",
        editClassName ?? "",
      ].join(" ")
    : ["hover:shadow-md", viewClassName ?? ""].join(" ")

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onActivate()
        }
      }}
      className={[base, modeClass, className ?? ""].join(" ")}
    >
      {children}
    </Card>
  )
}
