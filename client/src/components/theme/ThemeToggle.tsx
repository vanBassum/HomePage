import { Moon, Sun } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useTheme } from "@/components/theme/theme-provider" // adjust import path to where your ThemeProvider lives

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  // If user has "system", determine the effective theme for icon/label.
  const effectiveTheme =
    theme === "system"
      ? window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
        ? "dark"
        : "light"
      : theme

  const isDark = effectiveTheme === "dark"

  return (
    <SidebarMenuButton
      onClick={() => setTheme(isDark ? "light" : "dark")}
      tooltip={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <Sun /> : <Moon />}
      <span>{isDark ? "Light theme" : "Dark theme"}</span>
    </SidebarMenuButton>
  )
}
