import { useEffect, useState } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "sonner"
import type { AppLink } from "@/components/models/AppLink"
import { Shell } from "@/components/Shell"
import { MyAppsPage } from "@/components/AppsPage"
import { appApiClient } from "@/components/api/ApiClient"
import { ModeProvider } from "@/components/mode/mode-provider"

function App() {
  const location = useLocation()
  const path = location.pathname

  const [apps, setApps] = useState<AppLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    appApiClient.getAll().then(result => {
      setApps(result)
      setLoading(false)
    })
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeProvider defaultMode="view" storageKey="app-mode">
        {loading ? (
          <div className="p-4">Loading applications…</div>
        ) : (
          <Shell>
            <Routes>
              <Route path="*" element={<MyAppsPage apps={apps} />} />
            </Routes>
          </Shell>
        )}

        <Toaster richColors />
        <span className="sr-only">{path}</span>
      </ModeProvider>
    </ThemeProvider>
  )
}

export default App
