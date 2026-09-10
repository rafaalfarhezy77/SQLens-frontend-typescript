import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { QueryStepCard } from "./query-step-card"
import { JoinVisualizer } from "./join-visualizer"
import { type QueryStep, type JoinDetails } from "../types/query.types"
import { Cpu, AlertTriangle, HelpCircle } from "lucide-react"

interface QueryExplanationProps {
  steps?: QueryStep[]
  joinDetails?: JoinDetails
  errorMessage?: string
  errorHint?: string
  isIdle?: boolean
}

export function QueryExplanation({
  steps,
  joinDetails,
  errorMessage,
  errorHint,
  isIdle = false,
}: QueryExplanationProps) {
  // Case 1: Error during execution
  if (errorMessage) {
    return (
      <Card variant="default" className="border-[#EF4444] shadow-[4px_4px_0px_#EF4444]">
        <CardHeader className="border-b-2 border-[#EF4444] bg-red-50/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
              QUERY EXECUTION ERROR
            </CardTitle>
            <Badge variant="error" size="sm">
              ERROR
            </Badge>
          </div>
          <p className="text-xs text-red-800 font-medium">
            Simulasi eksekusi mendeteksi masalah pada struktur query Anda
          </p>
        </CardHeader>

        <CardContent className="pt-4 space-y-4 font-mono">
          <div className="p-3 bg-red-100 border-2 border-[#EF4444] text-xs font-bold text-red-950">
            &bull; {errorMessage}
          </div>

          {errorHint && (
            <div className="p-3 bg-[#FFF3A3] border-2 border-[#111111] text-xs font-medium text-[#111111] space-y-1">
              <span className="font-black flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Saran Edukasi:
              </span>
              <p className="font-sans leading-relaxed">{errorHint}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Case 2: Idle State before running query
  if (isIdle || !steps || steps.length === 0) {
    return (
      <Card variant="default" className="h-full">
        <CardHeader className="border-b-2 border-[#111111] pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#111111]" />
            QUERY-TO-VISUAL EXPLANATION
          </CardTitle>
          <p className="text-xs text-zinc-500">Visualisasi alur eksekusi logika basis data</p>
        </CardHeader>

        <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
          <div className="w-12 h-12 bg-[#FFF3A3] border-2 border-[#111111] shadow-neo-sm flex items-center justify-center mb-3">
            <Cpu className="w-6 h-6 text-[#111111]" />
          </div>
          <p className="font-mono font-black text-sm uppercase text-[#111111]">
            EXPLANATION PIPELINE READY.
          </p>
          <p className="text-xs text-zinc-500 max-w-xs mt-1 leading-relaxed">
            Jalankan query untuk melihat bagaimana data dievaluasi langkah demi langkah dari klausa <strong>FROM</strong>, <strong>WHERE</strong>, hingga <strong>SELECT</strong>.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Case 3: Success state with steps and optional join diagram
  return (
    <Card variant="default" className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="border-b-2 border-[#111111] pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#111111]" />
              HOW YOUR QUERY WORKS
            </CardTitle>
            <Badge variant="yellow" size="sm" className="font-mono">
              {steps.length} TAHAPAN
            </Badge>
          </div>
          <p className="text-xs text-zinc-600">
            Penjelasan urutan evaluasi query logis (Query-to-Visual Explanation)
          </p>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          {/* Relational diagram if this was a JOIN query */}
          {joinDetails && (
            <div className="mb-4">
              <JoinVisualizer joinDetails={joinDetails} />
            </div>
          )}

          {/* Sequence of execution stages */}
          {steps.map((step, idx) => (
            <QueryStepCard
              key={step.stepNumber}
              step={step}
              isLast={idx === steps.length - 1}
            />
          ))}
        </CardContent>
      </div>

      <div className="p-3 bg-[#F7F7F2] border-t-2 border-[#111111] text-[11px] font-mono text-zinc-600">
        <span>Urutan eksekusi logis: FROM &rarr; WHERE/JOIN &rarr; SELECT</span>
      </div>
    </Card>
  )
}
