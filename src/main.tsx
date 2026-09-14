import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"
import { setupMockFetch } from "./lib/mock-api/mock-fetch"

// Initialize client-side native Fetch API mock router
setupMockFetch()

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Gagal menemukan elemen #root dalam dokumen.")
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
