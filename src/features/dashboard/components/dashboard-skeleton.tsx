export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-label="Loading dashboard data">
      {/* Welcome Banner Skeleton */}
      <div className="p-6 bg-white border-4 border-[#111111] shadow-neo space-y-3">
        <div className="h-8 w-64 bg-zinc-200 border-2 border-[#111111]"></div>
        <div className="h-4 w-96 max-w-full bg-zinc-100 border border-[#111111]"></div>
      </div>

      {/* 4 Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 bg-white border-3 border-[#111111] shadow-neo space-y-3"
          >
            <div className="h-3 w-24 bg-zinc-200 border border-[#111111]"></div>
            <div className="h-9 w-20 bg-zinc-300 border-2 border-[#111111]"></div>
            <div className="h-2 w-32 bg-zinc-100"></div>
          </div>
        ))}
      </div>

      {/* Main 2-Column Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 p-6 bg-white border-3 border-[#111111] shadow-neo space-y-4">
          <div className="h-6 w-48 bg-zinc-200 border border-[#111111]"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5 pt-2">
              <div className="flex justify-between">
                <div className="h-3 w-28 bg-zinc-200"></div>
                <div className="h-3 w-10 bg-zinc-200"></div>
              </div>
              <div className="h-4 w-full bg-zinc-100 border-2 border-[#111111]"></div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5 p-6 bg-[#FFD600]/30 border-3 border-[#111111] shadow-neo space-y-4">
          <div className="h-4 w-20 bg-zinc-300"></div>
          <div className="h-7 w-48 bg-zinc-300 border border-[#111111]"></div>
          <div className="h-16 w-full bg-white/60 border border-[#111111]"></div>
          <div className="h-10 w-full bg-zinc-300 border-2 border-[#111111]"></div>
        </div>
      </div>

      {/* Recent Queries Skeleton */}
      <div className="p-6 bg-white border-3 border-[#111111] shadow-neo space-y-4">
        <div className="h-6 w-56 bg-zinc-200 border border-[#111111]"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 w-full bg-zinc-100 border-2 border-[#111111]"></div>
        ))}
      </div>
    </div>
  )
}
