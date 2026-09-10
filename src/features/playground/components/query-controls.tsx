import { Play, RotateCcw, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"

export type ExecutionUiStatus = "idle" | "loading" | "success" | "error"

interface QueryControlsProps {
  status: ExecutionUiStatus
  onRun: () => void
  onClear: () => void
}

export function QueryControls({ status, onRun, onClear }: QueryControlsProps) {
  const isLoading = status === "loading"

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-1">
      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={isLoading}
          onClick={onRun}
          className="min-w-[150px]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent animate-spin inline-block"></span>
              RUNNING QUERY...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              RUN QUERY
            </span>
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          disabled={isLoading}
          onClick={onClear}
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          CLEAR
        </Button>
      </div>

      {/* Execution Status Badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold uppercase text-zinc-500">
          STATUS:
        </span>
        {status === "idle" && (
          <Badge variant="neutral" size="md" className="font-mono">
            <span className="w-2 h-2 rounded-none bg-zinc-400 inline-block"></span>
            READY
          </Badge>
        )}
        {status === "loading" && (
          <Badge variant="yellow" size="md" className="font-mono animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            RUNNING
          </Badge>
        )}
        {status === "success" && (
          <Badge variant="success" size="md" className="font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SUCCESS
          </Badge>
        )}
        {status === "error" && (
          <Badge variant="error" size="md" className="font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            ERROR
          </Badge>
        )}
      </div>
    </div>
  )
}
