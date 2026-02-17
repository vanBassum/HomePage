import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Card } from "@/components/ui/card"
import { useMode } from "@/components/mode/mode-provider"

type ClickableCardProps = {
  children: React.ReactNode
  onActivate?: () => void
  className?: string
  editClassName?: string
  viewClassName?: string
  asChild?: boolean
}

export function ClickableCard({
  children,
  onActivate,
  className,
  editClassName,
  viewClassName,
  asChild,
}: ClickableCardProps) {
  const { mode } = useMode()
  const isEdit = mode === "edit"

  const base =
    "group h-28 overflow-hidden transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"

  const modeClass = isEdit
    ? [
        "hover:shadow-lg",
        "border-dashed ring-1 ring-blue-500/30 bg-blue-500/5",
        editClassName ?? "",
      ].join(" ")
    : ["hover:shadow-md", viewClassName ?? ""].join(" ")

  const Comp: any = asChild ? Slot : Card

  // When rendered as <a>, do NOT add role/tabIndex or keyboard activation;
  // the anchor handles accessibility + new-tab/middle-click natively.
  const interactiveProps = asChild
    ? {}
    : {
        role: "button",
        tabIndex: 0,
        onClick: onActivate,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onActivate?.()
          }
        },
      }

  return (
    <Comp className={[base, modeClass, className ?? ""].join(" ")} {...interactiveProps}>
      {children}
    </Comp>
  )
}
