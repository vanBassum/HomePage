import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Mode = "view" | "edit"

type ModeProviderProps = {
  children: React.ReactNode
  defaultMode?: Mode
  storageKey?: string
}

type ModeProviderState = {
  mode: Mode
  setMode: (mode: Mode) => void
  toggleMode: () => void
}

const initialState: ModeProviderState = {
  mode: "view",
  setMode: () => null,
  toggleMode: () => null,
}

const ModeProviderContext = createContext<ModeProviderState>(initialState)

export function ModeProvider({
  children,
  defaultMode = "view",
  storageKey = "app-mode",
}: ModeProviderProps) {
  const [mode, setModeState] = useState<Mode>(() => {
    const stored = localStorage.getItem(storageKey) as Mode | null
    return stored ?? defaultMode
  })

  useEffect(() => {
    localStorage.setItem(storageKey, mode)
  }, [mode, storageKey])

  const value = useMemo<ModeProviderState>(() => {
    return {
      mode,
      setMode: (next) => setModeState(next),
      toggleMode: () => setModeState((m) => (m === "view" ? "edit" : "view")),
    }
  }, [mode])

  return (
    <ModeProviderContext.Provider value={value}>
      {children}
    </ModeProviderContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeProviderContext)
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider")
  }
  return context
}
