import { Database, Terminal, User, LogOut } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { type Student } from "../types/dashboard.types"

interface DashboardHeaderProps {
  student: Student
  onSignOut: () => void
  onNavigatePlayground?: () => void
}

export function DashboardHeader({
  student,
  onSignOut,
  onNavigatePlayground,
}: DashboardHeaderProps) {
  return (
    <header className="border-b-4 border-[#111111] bg-[#FFFFFF] px-4 sm:px-8 py-3.5 shadow-neo-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Nav items */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FFD600] border-2 border-[#111111] shadow-neo-sm flex items-center justify-center font-mono font-black text-sm">
              <Database className="w-4 h-4 text-[#111111]" />
            </div>
            <div>
              <span className="font-mono font-black tracking-tight text-base sm:text-lg block leading-none">
                SQLENS
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                Tutor Basis Data
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav aria-label="Main Dashboard Navigation" className="hidden sm:flex items-center gap-2">
            <span className="bg-[#FFD600] text-[#111111] border-2 border-[#111111] shadow-neo-sm px-3 py-1 text-xs font-black uppercase tracking-wider select-none">
              Dashboard
            </span>
            {onNavigatePlayground ? (
              <button
                type="button"
                onClick={onNavigatePlayground}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-black hover:bg-[#F7F7F2] border-2 border-transparent transition-all cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>SQL Playground</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-400 border-2 border-transparent">
                <Terminal className="w-3.5 h-3.5" />
                <span>SQL Playground</span>
              </div>
            )}
          </nav>
        </div>

        {/* Student Profile & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F7F7F2] border-2 border-[#111111] px-3 py-1 shadow-neo-sm">
            <div className="w-6 h-6 bg-[#FFD600] border border-[#111111] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-[#111111]" />
            </div>
            <div className="text-left">
              <span className="text-xs font-black block leading-none text-[#111111]">
                {student.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block leading-none mt-0.5">
                Semester {student.semester} &bull; S1 TI
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            aria-label="Keluar dari akun"
            title="Keluar / Kembali ke Login"
            className="text-xs"
          >
            <LogOut className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
