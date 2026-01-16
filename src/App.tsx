import { Routes, Route, useLocation } from "react-router-dom"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "sonner"
import { Shell } from "@/components/Shell"
import { MyAppsPage } from "@/components/MyAppsPage"
import { ModeProvider } from "@/components/mode/mode-provider"

function App() {
  const location = useLocation()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeProvider defaultMode="view" storageKey="app-mode">
        <Shell>
          <Routes>
            <Route path="*" element={<MyAppsPage />} />
          </Routes>
        </Shell>

        <Toaster richColors />
        <span className="sr-only">{location.pathname}</span>
      </ModeProvider>
    </ThemeProvider>
  )
}

export default App
