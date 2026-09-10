import * as React from "react"
import { AuthPage } from "./pages/auth-page"
import { DashboardPage } from "./pages/dashboard-page"
import { PlaygroundPage } from "./pages/playground-page"

export type AppView = "auth" | "dashboard" | "playground"

export function App() {
  // Derive initial page from URL hash or path
  const getInitialView = (): AppView => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase()
      const path = window.location.pathname.toLowerCase()
      if (hash.includes("playground") || path.includes("playground")) {
        return "playground"
      }
      if (hash.includes("dashboard") || path.includes("dashboard")) {
        return "dashboard"
      }
    }
    return "auth"
  }

  const [currentView, setCurrentView] = React.useState<AppView>(getInitialView)

  // Sync route changes with browser history
  const navigateTo = (view: AppView) => {
    setCurrentView(view)
    if (typeof window !== "undefined") {
      window.location.hash = view
    }
  }

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash.includes("playground")) {
        setCurrentView("playground")
      } else if (hash.includes("dashboard")) {
        setCurrentView("dashboard")
      } else {
        setCurrentView("auth")
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  if (currentView === "playground") {
    return (
      <PlaygroundPage
        onNavigateDashboard={() => navigateTo("dashboard")}
        onSignOut={() => navigateTo("auth")}
      />
    )
  }

  if (currentView === "dashboard") {
    return (
      <DashboardPage
        onSignOut={() => navigateTo("auth")}
        onNavigatePlayground={() => navigateTo("playground")}
      />
    )
  }

  return (
    <AuthPage
      onNavigateToDashboard={() => navigateTo("dashboard")}
    />
  )
}

export default App
