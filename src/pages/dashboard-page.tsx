import * as React from "react"
import { DashboardHeader } from "../features/dashboard/components/dashboard-header"
import { DashboardStats } from "../features/dashboard/components/dashboard-stats"
import { LearningProgress } from "../features/dashboard/components/learning-progress"
import { NextTopicCard } from "../features/dashboard/components/next-topic-card"
import { RecentQueryList } from "../features/dashboard/components/recent-query-list"
import { DashboardSkeleton } from "../features/dashboard/components/dashboard-skeleton"
import { DashboardError } from "../features/dashboard/components/dashboard-error"
import { getDashboardData } from "../features/dashboard/services/dashboard.service"
import { type AsyncState } from "../types/async-state"
import { type DashboardData } from "../features/dashboard/types/dashboard.types"
import { Terminal } from "lucide-react"

interface DashboardPageProps {
  onSignOut: () => void
  onNavigatePlayground?: () => void
}

export function DashboardPage({ onSignOut, onNavigatePlayground }: DashboardPageProps) {
  // Strict discriminated union state for dashboard data lifecycle
  const [dashboardState, setDashboardState] = React.useState<AsyncState<DashboardData>>({
    status: "idle",
  })

  // Asynchronous data fetching flow with try/catch and unknown error handling
  const fetchDashboard = React.useCallback(async (triggerError: boolean = false) => {
    try {
      setDashboardState({ status: "loading" })

      const data = await getDashboardData(undefined, triggerError)

      setDashboardState({
        status: "success",
        data,
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil data dashboard mahasiswa. Silakan muat ulang halaman."

      setDashboardState({
        status: "error",
        error: message,
      })
    }
  }, [])

  // Initial fetch on mount
  React.useEffect(() => {
    void fetchDashboard(false)
  }, [fetchDashboard])

  // Branch rendering on discriminated union status
  if (dashboardState.status === "loading" || dashboardState.status === "idle") {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex flex-col justify-between">
        <header className="border-b-4 border-[#111111] bg-[#FFFFFF] px-4 sm:px-8 py-3.5 shadow-neo-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="h-6 w-32 bg-zinc-200 animate-pulse"></div>
            <div className="h-8 w-24 bg-zinc-200 animate-pulse"></div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1">
          <DashboardSkeleton />
        </main>
      </div>
    )
  }

  if (dashboardState.status === "error") {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex flex-col justify-between">
        <header className="border-b-4 border-[#111111] bg-[#FFFFFF] px-4 sm:px-8 py-3.5 shadow-neo-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="font-mono font-black text-lg">SQLENS</span>
            <button
              type="button"
              onClick={onSignOut}
              className="font-mono text-xs font-bold underline"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 flex items-center justify-center">
          <DashboardError
            errorMessage={dashboardState.error}
            onRetry={() => void fetchDashboard(false)}
          />
        </main>
      </div>
    )
  }

  const { data } = dashboardState

  return (
    <div className="min-h-screen bg-[#F7F7F2] flex flex-col justify-between text-[#111111]">
      {/* Top Navigation */}
      <DashboardHeader
        student={data.student}
        onSignOut={onSignOut}
        onNavigatePlayground={onNavigatePlayground}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
        {/* Welcome Section */}
        <section aria-labelledby="welcome-heading" className="bg-[#FFFFFF] border-4 border-[#111111] shadow-neo p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-1">
                OVERVIEW MAHASISWA &bull; TAHAP PRAKTIKUM
              </p>
              <h1 id="welcome-heading" className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]">
                YOUR LEARNING DASHBOARD.
              </h1>
              <p className="text-sm sm:text-base font-medium text-zinc-700 mt-2 max-w-2xl">
                Selamat datang kembali, <strong className="text-black underline decoration-[#FFD600] decoration-3 underline-offset-4">{data.student.name}</strong>. Lihat kemajuan belajar SQL-mu dan lanjutkan latihan query dari materi terakhir.
              </p>
            </div>

            {/* Test Error / Retry demonstrator button */}
            <div className="shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={() => void fetchDashboard(true)}
                title="Klik untuk mensimulasikan kegagalan server dan menguji tombol retry"
                className="text-[10px] font-mono font-bold text-zinc-500 hover:text-red-600 underline cursor-pointer"
              >
                [Simulasi Error &amp; Retry]
              </button>
            </div>
          </div>
        </section>

        {/* 4 Statistics Metric Cards */}
        <section aria-label="Statistik Belajar SQL">
          <DashboardStats stats={data.stats} recentActivities={data.recentActivities} />
        </section>

        {/* 2-Column Section: Learning Progress & Next Up Module */}
        <section aria-label="Progres Topik dan Modul Rekomendasi" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7">
            <LearningProgress topics={data.learningTopics} />
          </div>
          <div className="lg:col-span-5">
            <NextTopicCard nextTopic={data.nextTopic} />
          </div>
        </section>

        {/* Full-Width Recent Query Activity List */}
        <section aria-label="Riwayat Aktivitas Query">
          <RecentQueryList activities={data.recentActivities} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[#111111] bg-[#FFFFFF] px-4 py-4 text-center text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold text-zinc-700">
            &copy; 2026 SQLens — Web-Based Interactive SQL Execution &amp; Query Tutor.
          </p>
          <p className="font-semibold text-zinc-500 text-[11px] flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-[#FFD600]" />
            Learning Dashboard &bull; Page 2 Active
          </p>
        </div>
      </footer>
    </div>
  )
}
