import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "sonner"
import { Shell } from "@/components/Shell"
import { MyAppsPage } from "@/components/MyAppsPage"
import { ModeProvider } from "@/components/mode/mode-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeProvider defaultMode="view" storageKey="app-mode">
        test
        <Shell>
          <MyAppsPage />
        </Shell>

        <Toaster richColors />
      </ModeProvider>
    </ThemeProvider>
  )
}

export default App
