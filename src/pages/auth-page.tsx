import { AuthCard } from "../features/auth/components/auth-card"
import { Database } from "lucide-react"

interface AuthPageProps {
  onNavigateToDashboard?: () => void
}

export function AuthPage({ onNavigateToDashboard }: AuthPageProps) {
  return (
    <div className="min-h-screen bg-[#F7F7F2] flex flex-col justify-between text-[#111111]">
      {/* Top Bar */}
      <header className="border-b-4 border-[#111111] bg-[#FFFFFF] px-4 sm:px-8 py-3.5 shadow-neo-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FFD600] border-2 border-[#111111] shadow-neo-sm flex items-center justify-center font-mono font-black text-sm">
              <Database className="w-4 h-4 text-[#111111]" />
            </div>
            <div>
              <span className="font-mono font-black tracking-tight text-base sm:text-lg block leading-none">
                SQLENS
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                Database Query Tutor
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area (Centered Card Layout) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md my-4">
          <AuthCard onNavigateToDashboard={onNavigateToDashboard} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[#111111] bg-[#FFFFFF] px-4 py-4 text-center text-xs font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold text-zinc-700">
            &copy; 2026 SQLens — Web-Based Interactive SQL Execution &amp; Query Tutor.
          </p>
          <p className="font-semibold text-zinc-500 text-[11px]">
            Halaman Otentikasi
          </p>
        </div>
      </footer>
    </div>
  )
}
