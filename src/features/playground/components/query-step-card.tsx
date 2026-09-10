import { Badge } from "../../../components/ui/badge"
import { type QueryStep } from "../types/query.types"

interface QueryStepCardProps {
  step: QueryStep
  isLast?: boolean
}

export function QueryStepCard({ step, isLast = false }: QueryStepCardProps) {
  const getBadgeVariant = (type: QueryStep["type"]) => {
    switch (type) {
      case "from":
        return "neutral"
      case "where":
      case "having":
        return "yellow"
      case "join":
        return "success"
      case "select":
      case "orderBy":
      case "limit":
      case "groupBy":
      default:
        return "neutral"
    }
  }

  return (
    <div className="relative">
      <div className="p-3.5 bg-[#FFFFFF] border-2 border-[#111111] shadow-neo-sm space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant={getBadgeVariant(step.type)}
            size="sm"
            className="font-mono text-[10px]"
          >
            TAHAP {step.stepNumber} &bull; {step.type.toUpperCase()}
          </Badge>
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">
            LOGICAL OPERATOR
          </span>
        </div>

        <div>
          <h5 className="font-mono font-black text-xs text-[#111111]">
            {step.title}
          </h5>
          <p className="text-xs font-medium text-zinc-700 mt-1 leading-relaxed">
            {step.description}
          </p>
        </div>

        {step.details && (
          <div className="p-2 bg-[#F7F7F2] border border-[#111111] text-[11px] font-mono text-zinc-600 font-semibold">
            &bull; {step.details}
          </div>
        )}
      </div>

      {!isLast && (
        <div className="flex justify-center py-1.5" aria-hidden="true">
          <span className="text-sm font-black font-mono text-[#111111] select-none">
            &darr;
          </span>
        </div>
      )}
    </div>
  )
}
