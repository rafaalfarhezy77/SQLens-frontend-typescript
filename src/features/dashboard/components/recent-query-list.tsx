import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { type QueryActivity } from "../types/dashboard.types"
import { Terminal, Clock, CheckCircle2, XCircle, ExternalLink, X, Database } from "lucide-react"

interface RecentQueryListProps {
  activities: QueryActivity[]
}

export function RecentQueryList({ activities }: RecentQueryListProps) {
  const [selectedQuery, setSelectedQuery] = React.useState<QueryActivity | null>(null)

  /**
   * Meaningful DOM Event Delegation Handler
   * A single parent-level click handler managing all row actions
   */
  const handleQueryListAction = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const actionBtn = target.closest<HTMLButtonElement>("[data-action]")
    if (!actionBtn) return

    const action = actionBtn.dataset["action"]
    const queryId = actionBtn.dataset["queryId"]

    if (action === "open-query" && queryId) {
      const found = activities.find((item) => item.id === queryId)
      if (found) {
        setSelectedQuery(found)
      }
    }
  }

  return (
    <>
      <Card variant="default">
        <CardHeader className="border-b-2 border-[#111111] pb-4">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              RECENT QUERY ACTIVITY
            </CardTitle>
            <span className="text-xs font-mono font-bold text-zinc-600">
              {activities.length} Aktivitas Tercatat
            </span>
          </div>
          <p className="text-xs font-medium text-zinc-600">
            Riwayat eksekusi sandbox SQL mahasiswa terkini
          </p>
        </CardHeader>

        <CardContent className="pt-5">
          {activities.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-[#111111] bg-[#F7F7F2]">
              <p className="font-black text-sm uppercase tracking-wider text-[#111111]">
                NO QUERY ACTIVITY YET.
              </p>
              <p className="text-xs text-zinc-600 mt-1 max-w-sm mx-auto">
                Anda belum menjalankan query apapun. Buka SQL Playground untuk memulai sesi latihan query pertama Anda.
              </p>
            </div>
          ) : (
            /* Parent delegation container */
            <div
              data-query-list
              onClick={handleQueryListAction}
              className="divide-y-2 divide-[#111111] border-2 border-[#111111]"
            >
              {activities.map((item) => (
                <div
                  key={item.id}
                  className="p-3 sm:p-4 bg-[#FFFFFF] hover:bg-[#FFF3A3]/25 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
                    </div>

                    <code className="font-mono text-xs sm:text-sm text-[#111111] font-bold block truncate bg-[#F7F7F2] p-1.5 border border-[#111111]">
                      {item.sql}
                    </code>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0">
                    {/* Event-delegated trigger button */}
                    <button
                      type="button"
                      data-action="open-query"
                      data-query-id={item.id}
                      className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-[#FFFFFF] hover:bg-[#FFD600] text-[#111111] border-2 border-[#111111] shadow-neo-sm hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer select-none flex items-center gap-1"
                    >
                      <span>Lihat Detail</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Query Detail Modal Dialog (Safe Page 2 Interaction) */}
      {selectedQuery && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="query-detail-title"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg bg-[#FFFFFF] border-4 border-[#111111] shadow-neo-xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-[#FFD600] border-b-3 border-[#111111]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#111111]" />
                <h4 id="query-detail-title" className="font-mono font-black text-sm uppercase">
                  QUERY LOG INSPECTOR
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuery(null)}
                aria-label="Tutup jendela pratinjau"
                className="w-7 h-7 bg-white border-2 border-[#111111] flex items-center justify-center hover:bg-red-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant={selectedQuery.status === "success" ? "success" : "error"}
                  size="md"
                  className="font-mono"
                >
                  {selectedQuery.status === "success" ? "STATUS: SUCCESS" : "STATUS: SYNTAX_ERROR"}
                </Badge>
                <span className="text-xs font-mono text-zinc-600 font-bold">
                  {selectedQuery.executedAt}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                  SQL Statement:
                </span>
                <pre className="p-3 bg-[#F7F7F2] border-2 border-[#111111] font-mono text-xs text-[#111111] overflow-x-auto whitespace-pre-wrap font-bold leading-relaxed shadow-neo-sm">
                  {selectedQuery.sql}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 border border-[#111111] bg-white">
                  <span className="text-zinc-500 block text-[10px]">WAKTU EKSEKUSI</span>
                  <span className="font-bold">{selectedQuery.executionTimeMs ?? 15} ms</span>
                </div>
                <div className="p-2 border border-[#111111] bg-white">
                  <span className="text-zinc-500 block text-[10px]">BARIS DATA TERPENGARUH</span>
                  <span className="font-bold">{selectedQuery.affectedRows ?? 0} rows</span>
                </div>
              </div>

              {/* Page 3 notice */}
              <div className="p-3 bg-[#FFF3A3] border-2 border-dashed border-[#111111] text-xs font-medium text-[#111111]">
                &bull; <strong>Notice:</strong> SQL Sandbox interaktif &amp; visualisasi eksekusi query lengkap akan dihubungkan pada <strong>Page 3 (SQL Playground)</strong>.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F7F7F2] border-t-2 border-[#111111] flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedQuery(null)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
