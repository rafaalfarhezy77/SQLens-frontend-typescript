import { Button } from "../../../components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"

interface DashboardErrorProps {
  errorMessage: string
  onRetry: () => void
}

export function DashboardError({ errorMessage, onRetry }: DashboardErrorProps) {
  return (
    <div
      role="alert"
      className="p-8 sm:p-12 bg-[#FFFFFF] border-4 border-[#111111] shadow-neo-xl max-w-xl mx-auto my-12 text-center space-y-6"
    >
      <div className="w-16 h-16 bg-red-100 border-3 border-[#111111] shadow-neo-sm mx-auto flex items-center justify-center text-[#EF4444]">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-[#111111]">
          WE COULDN&apos;T LOAD YOUR DASHBOARD.
        </h2>
        <p className="text-sm font-medium text-zinc-600 max-w-md mx-auto">
          Terjadi kendala saat memuat data pembelajaran dari server. Periksa kembali koneksi atau coba muat ulang.
        </p>
      </div>

      <div className="p-3 bg-red-50 border-2 border-[#EF4444] font-mono text-xs text-red-900 font-bold text-left">
        &bull; Error details: {errorMessage}
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={onRetry}
        className="mx-auto"
      >
        <RotateCcw className="w-4 h-4 mr-1" />
        TRY AGAIN
      </Button>
    </div>
  )
}
