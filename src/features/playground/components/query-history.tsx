import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { QueryIdSchema } from "../schemas/query.schema"
import { type QueryHistoryItem } from "../types/query.types"
import { History, CheckCircle2, XCircle, Clock, ArrowUpRight } from "lucide-react"

interface QueryHistoryProps {
  history: QueryHistoryItem[]
  onLoadQuery: (sql: string) => void
}

export function QueryHistory({ history, onLoadQuery }: QueryHistoryProps) {
  /**
   * Meaningful DOM Event Delegation Handler with Branded ID Dataset Validation
   */
  const handleHistoryAction = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const actionBtn = target.closest<HTMLButtonElement>("[data-action]")
    if (!actionBtn) return

    const action = actionBtn.dataset["action"]
    const rawQueryId = actionBtn.dataset["queryId"]

    // Safe runtime validation of dataset string to branded QueryId
    const parseResult = QueryIdSchema.safeParse(rawQueryId)
    if (!parseResult.success) return

    const validQueryId = parseResult.data

    if (action === "load-query") {
      const selectedItem = history.find((h) => h.id === validQueryId)
      if (selectedItem) {
        onLoadQuery(selectedItem.sql)
      }
    }
  }

  return (
    <Card variant="default">
      <CardHeader className="border-b-2 border-[#111111] pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <History className="w-4 h-4 text-[#111111]" />
            QUERY HISTORY &bull; RIWAYAT LATIHAN
          </CardTitle>
          <span className="text-xs font-mono font-bold text-zinc-500">
            {history.length} Item Tersimpan
          </span>
        </div>
        <p className="text-xs text-zinc-600">
          Klik <strong>LOAD</strong> untuk memuat kembali query sebelumnya ke editor tanpa langsung mengeksekusinya
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        {history.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-[#111111] bg-[#F7F7F2]">
            <p className="font-mono font-bold text-xs uppercase text-zinc-600">
              BELUM ADA RIWAYAT QUERY
            </p>
          </div>
        ) : (
          /* Parent Event Delegation Container */
          <div
            data-query-history
            onClick={handleHistoryAction}
            className="divide-y-2 divide-[#111111] border-2 border-[#111111]"
          >
            {history.map((item) => (
              <article
                key={item.id}
                data-query-id={item.id}
                className="p-3 bg-[#FFFFFF] hover:bg-[#FFF3A3]/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={item.status === "success" ? "success" : "error"}
                      size="sm"
                      className="font-mono text-[10px]"
                    >
                      {item.status === "success" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {item.status.toUpperCase()}
                    </Badge>

                    <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.executedAt}
                    </span>

                    {item.status === "success" && (
                      <span className="text-[11px] font-mono text-zinc-500">
                        &bull; {item.rowCount} rows
                      </span>
                    )}
                  </div>

                  <code className="font-mono text-xs text-[#111111] font-bold block truncate bg-[#F7F7F2] p-1.5 border border-[#111111]">
                    {item.sql}
                  </code>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  {/* Event-delegated trigger button */}
                  <button
                    type="button"
                    data-action="load-query"
                    data-query-id={item.id}
                    className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-[#FFFFFF] hover:bg-[#FFD600] text-[#111111] border-2 border-[#111111] shadow-neo-sm hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer select-none flex items-center gap-1"
                  >
                    <span>Load Query</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
