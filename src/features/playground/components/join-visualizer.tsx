import { type JoinDetails } from "../types/query.types"
import { ArrowRight, Link2 } from "lucide-react"

interface JoinVisualizerProps {
  joinDetails: JoinDetails
}

export function JoinVisualizer({ joinDetails }: JoinVisualizerProps) {
  return (
    <div className="p-4 bg-[#FFF3A3] border-2 border-[#111111] shadow-neo-sm space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase text-[#111111] flex items-center gap-1.5">
          <Link2 className="w-4 h-4 text-[#111111]" />
          RELATIONAL JOIN DIAGRAM
        </span>
        <span className="bg-[#FFFFFF] border border-[#111111] px-1.5 py-0.5 text-[10px] font-bold">
          {joinDetails.joinType}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-center text-xs">
        {/* Left Table Box */}
        <div className="p-2.5 bg-[#FFFFFF] border-2 border-[#111111] shadow-neo-sm">
          <span className="font-black text-sm block">{joinDetails.leftTable.toUpperCase()}</span>
          <span className="text-[11px] text-zinc-600 block mt-1">
            FK: <code className="font-bold text-[#111111] bg-zinc-100 px-1">{joinDetails.leftKey}</code>
          </span>
        </div>

        {/* Link / Match Indicator */}
        <div className="flex flex-col items-center justify-center text-[10px] font-bold text-[#111111] py-1">
          <span className="hidden sm:inline-block">matched on:</span>
          <div className="flex items-center gap-1 font-black my-0.5">
            <span>&mdash;</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#111111]" />
          </div>
          <span className="text-[9px] text-zinc-600 truncate max-w-full">
            {joinDetails.leftTable}.{joinDetails.leftKey} = {joinDetails.rightTable}.{joinDetails.rightKey}
          </span>
        </div>

        {/* Right Table Box */}
        <div className="p-2.5 bg-[#FFFFFF] border-2 border-[#111111] shadow-neo-sm">
          <span className="font-black text-sm block">{joinDetails.rightTable.toUpperCase()}</span>
          <span className="text-[11px] text-zinc-600 block mt-1">
            PK: <code className="font-bold text-[#111111] bg-zinc-100 px-1">{joinDetails.rightKey}</code>
          </span>
        </div>
      </div>
    </div>
  )
}
