import * as React from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { type AuthMode } from "../types/auth.types"
import { cn } from "../../../lib/utils"

interface AuthCardProps {
  onNavigateToDashboard?: () => void
}

export function AuthCard({ onNavigateToDashboard }: AuthCardProps) {
  const [currentMode, setCurrentMode] = React.useState<AuthMode>("login")

  /**
   * Efficient DOM Event Delegation Handler
   * Captures click events on child buttons using data-auth-mode attribute
   */
  const handleAuthSwitcherClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const button = target.closest<HTMLButtonElement>("[data-auth-mode]")
    if (!button) return

    const mode = button.dataset["authMode"]
    if (mode === "login" || mode === "register") {
      setCurrentMode(mode)
    }
  }

  return (
    <div className="w-full bg-[#FFFFFF] border-4 border-[#111111] shadow-neo-xl p-6 sm:p-8 flex flex-col justify-center">
      <div>
        {/* Dynamic Headings */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-[#111111]">
            {currentMode === "login" ? "WELCOME BACK." : "CREATE YOUR ACCOUNT."}
          </h2>
          <p className="text-xs sm:text-sm font-medium text-zinc-600 mt-1">
            {currentMode === "login"
              ? "Continue your SQL learning journey. Masuk untuk melihat progres latihan."
              : "Mulai belajar SQL dengan lebih visual. Daftarkan akun praktikum Anda."}
          </p>
        </div>

        {/* DOM Event Delegation Switcher */}
        <div
          data-auth-switcher
          onClick={handleAuthSwitcherClick}
          className="mb-6 p-1.5 bg-[#F7F7F2] border-2 border-[#111111] grid grid-cols-2 gap-1.5 shadow-neo-sm"
          role="tablist"
          aria-label="Mode Otentikasi"
        >
          <button
            type="button"
            role="tab"
            aria-selected={currentMode === "login"}
            data-auth-mode="login"
            className={cn(
              "py-2 px-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-75 text-center cursor-pointer select-none",
              currentMode === "login"
                ? "bg-[#FFD600] text-[#111111] border-2 border-[#111111] shadow-neo-sm"
                : "bg-transparent text-zinc-600 hover:text-black border-2 border-transparent"
            )}
          >
            Sign In
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={currentMode === "register"}
            data-auth-mode="register"
            className={cn(
              "py-2 px-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-75 text-center cursor-pointer select-none",
              currentMode === "register"
                ? "bg-[#FFD600] text-[#111111] border-2 border-[#111111] shadow-neo-sm"
                : "bg-transparent text-zinc-600 hover:text-black border-2 border-transparent"
            )}
          >
            Create Account
          </button>
        </div>

        {/* Render Form based on Mode */}
        {currentMode === "login" ? (
          <LoginForm
            onSwitchToRegister={() => setCurrentMode("register")}
            onNavigateToDashboard={onNavigateToDashboard}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setCurrentMode("login")}
            onNavigateToDashboard={onNavigateToDashboard}
          />
        )}
      </div>
    </div>
  )
}
