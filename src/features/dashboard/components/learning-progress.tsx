import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { type LearningTopic } from "../types/dashboard.types"
import { CheckCircle2, BookMarked } from "lucide-react"

interface LearningProgressProps {
  topics: LearningTopic[]
}

export function LearningProgress({ topics }: LearningProgressProps) {
  return (
    <Card variant="default" className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="border-b-2 border-[#111111] pb-4">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="w-5 h-5" />
              LEARNING PROGRESS
            </CardTitle>
            <Badge variant="yellow" size="sm">
              MODUL SQL
            </Badge>
          </div>
          <p className="text-xs font-medium text-zinc-600">
            Kemajuan materi query basis data semester 3
          </p>
        </CardHeader>

        <CardContent className="pt-5 space-y-4">
          {topics.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-[#111111] bg-[#F7F7F2]">
              <p className="font-bold text-xs uppercase tracking-wider text-zinc-600">
                BELUM ADA TOPIK TERSEDIA
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Silakan hubungi pengajar untuk sinkronisasi kurikulum.
              </p>
            </div>
          ) : (
            topics.map((topic) => (
              <div key={topic.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-black text-[#111111] flex items-center gap-1.5">
                    {topic.completed && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    )}
                    {topic.name}
                  </span>
                  <span className="font-bold text-zinc-800">
                    {topic.progress}%
                  </span>
                </div>

                {/* Semantic Accessible Neo-Brutalist Progress Bar */}
                <div
                  role="progressbar"
                  aria-label={`Progres materi ${topic.name}`}
                  aria-valuenow={topic.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-3.5 w-full bg-[#F7F7F2] border-2 border-[#111111] shadow-neo-sm overflow-hidden"
                >
                  <div
                    className="h-full bg-[#FFD600] border-r-2 border-[#111111] transition-all duration-300"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </div>

      <div className="p-4 bg-[#F7F7F2] border-t-2 border-[#111111] text-[11px] font-mono text-zinc-600 flex items-center justify-between">
        <span>Selesaikan seluruh topik untuk membuka sertifikat kuis praktikum.</span>
      </div>
    </Card>
  )
}
