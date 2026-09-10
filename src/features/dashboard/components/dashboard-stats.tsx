import { Terminal, CheckSquare, Flame, TrendingUp } from "lucide-react"
import { Card, CardContent } from "../../../components/ui/card"
import { type DashboardStats as DashboardStatsType, type QueryActivity } from "../types/dashboard.types"

interface DashboardStatsProps {
  stats: DashboardStatsType
  recentActivities: QueryActivity[]
}

export function DashboardStats({ stats, recentActivities }: DashboardStatsProps) {
  // Derived state: compute success rate dynamically from activity logs
  const totalRecent = recentActivities.length
  const successfulQueries = recentActivities.filter((act) => act.status === "success").length
  const calculatedSuccessRate = totalRecent > 0 
    ? Math.round((successfulQueries / totalRecent) * 100) 
    : 100

  // Derived completion ratio percentage
  const topicsPercentage = stats.totalTopics > 0 
    ? Math.round((stats.completedTopics / stats.totalTopics) * 100) 
    : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Total Queries Run */}
      <Card variant="default">
        <CardContent className="p-5 flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-zinc-500 block">
              QUERIES RUN
            </span>
            <span className="text-3xl sm:text-4xl font-black text-[#111111] block mt-1">
              {stats.queriesRun}
            </span>
            <span className="text-xs font-semibold text-zinc-600 block mt-1">
              Total eksekusi SQL sandbox
            </span>
          </div>
          <div className="w-10 h-10 bg-[#FFF3A3] border-2 border-[#111111] shadow-neo-sm flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5 text-[#111111]" />
          </div>
        </CardContent>
      </Card>

      {/* Metric 2: Topics Completed */}
      <Card variant="default">
        <CardContent className="p-5 flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-zinc-500 block">
              TOPICS COMPLETED
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#111111]">
                {stats.completedTopics}
              </span>
              <span className="text-base font-black text-zinc-400">
                / {stats.totalTopics}
              </span>
            </div>
            <span className="text-xs font-semibold text-zinc-600 block mt-1">
              {topicsPercentage}% modul terselesaikan
            </span>
          </div>
          <div className="w-10 h-10 bg-[#FFFFFF] border-2 border-[#111111] shadow-neo-sm flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5 text-[#111111]" />
          </div>
        </CardContent>
      </Card>

      {/* Metric 3: Current Streak */}
      <Card variant="default">
        <CardContent className="p-5 flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-zinc-500 block">
              CURRENT STREAK
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#111111]">
                {stats.streakDays}
              </span>
              <span className="text-xs font-black text-zinc-600 uppercase">
                HARI BERTURUT
              </span>
            </div>
            <span className="text-xs font-semibold text-zinc-600 block mt-1">
              Konsistensi latihan harian
            </span>
          </div>
          <div className="w-10 h-10 bg-[#FFD600] border-2 border-[#111111] shadow-neo-sm flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-[#111111]" />
          </div>
        </CardContent>
      </Card>

      {/* Metric 4: Derived Success Rate */}
      <Card variant="default">
        <CardContent className="p-5 flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-zinc-500 block">
              SUCCESS RATE
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#111111]">
                {calculatedSuccessRate}%
              </span>
            </div>
            <span className="text-xs font-semibold text-zinc-600 block mt-1">
              {successfulQueries} dari {totalRecent} query sukses
            </span>
          </div>
          <div className="w-10 h-10 bg-[#10B981] border-2 border-[#111111] shadow-neo-sm flex items-center justify-center shrink-0 text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
