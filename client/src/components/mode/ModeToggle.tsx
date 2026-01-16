import { Eye, Pencil } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useMode } from "@/components/mode/mode-provider"

export function ModeToggle() {
  const { mode, toggleMode } = useMode()
  const isEdit = mode === "edit"

  return (
    <SidebarMenuButton
      onClick={toggleMode}
      tooltip={isEdit ? "Switch to view mode" : "Switch to edit mode"}
    >
      {isEdit ? <Eye /> : <Pencil />}
      <span>{isEdit ? "View mode" : "Edit mode"}</span>
    </SidebarMenuButton>
  )
}
