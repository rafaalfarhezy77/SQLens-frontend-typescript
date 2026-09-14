import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { type NextTopic } from "../types/dashboard.types"
import { ArrowRight, Clock, Award, Sparkles, CheckCircle2 } from "lucide-react"

interface NextTopicCardProps {
  nextTopic: NextTopic
}

export function NextTopicCard({ nextTopic }: NextTopicCardProps) {
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false)
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleContinue = () => {
    setIsSimulating(true)
    setFeedbackMessage("Memuat modul pembelajaran... (Modul interaktif lengkap ada pada Page 3)")
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      setIsSimulating(false)
    }, 1500)
  }

  return (
    <Card variant="yellow" className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="border-b-2 border-[#111111] pb-4">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="neutral" size="sm" className="font-mono">
              <Sparkles className="w-3 h-3 text-[#FFD600]" />
              NEXT UP
            </Badge>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#111111]">
              REKOMENDASI SISTEM
            </span>
          </div>
          <CardTitle className="pt-2 text-xl sm:text-2xl">
            {nextTopic.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-5 space-y-4">
          <p className="text-sm font-semibold text-[#111111] leading-relaxed">
            {nextTopic.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1 bg-white border border-[#111111] px-2.5 py-1 text-xs font-mono font-bold shadow-neo-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>Est. {nextTopic.estimatedMinutes} Menit</span>
            </div>
            <div className="flex items-center gap-1 bg-white border border-[#111111] px-2.5 py-1 text-xs font-mono font-bold shadow-neo-sm">
              <Award className="w-3.5 h-3.5" />
              <span>Tingkat: {nextTopic.difficulty}</span>
            </div>
          </div>

          {feedbackMessage && (
            <div className="p-3 bg-white border-2 border-[#111111] shadow-neo-sm text-xs font-bold text-[#111111] flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="pt-2 border-t-2 border-[#111111] bg-white/40">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSimulating}
          onClick={handleContinue}
          className="bg-[#FFFFFF] hover:bg-[#FFF3A3]"
        >
          {isSimulating ? (
            "MEMUAT MODUL..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              CONTINUE LEARNING <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
