import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { type QueryResult as QueryResultType } from "../types/query.types"
import { Table, CheckCircle2, Clock } from "lucide-react"

interface QueryResultProps {
  result?: QueryResultType
  isIdle?: boolean
  executionTimeMs?: number
}

export function QueryResult({
  result,
  isIdle = false,
  executionTimeMs,
}: QueryResultProps) {
  if (isIdle || !result) {
    return (
      <Card variant="default" className="h-full">
        <CardHeader className="border-b-2 border-[#111111] pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Table className="w-4 h-4 text-[#111111]" />
            QUERY RESULT
          </CardTitle>
          <p className="text-xs text-zinc-500">Output tabel hasil eksekusi</p>
        </CardHeader>
        <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
          <div className="w-12 h-12 bg-[#F7F7F2] border-2 border-[#111111] shadow-neo-sm flex items-center justify-center mb-3">
            <Table className="w-6 h-6 text-zinc-400" />
          </div>
          <p className="font-mono font-black text-sm uppercase text-[#111111]">
            READY TO QUERY.
          </p>
          <p className="text-xs text-zinc-500 max-w-xs mt-1 leading-relaxed">
            Ketik perintah SQL pada editor di atas lalu klik <strong>RUN QUERY</strong> untuk melihat representasi data tabular di sini.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="default" className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="border-b-2 border-[#111111] pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Table className="w-4 h-4 text-[#111111]" />
              QUERY RESULT
            </CardTitle>
            <div className="flex items-center gap-2 font-mono">
              {executionTimeMs !== undefined && (
                <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {executionTimeMs} ms
                </span>
              )}
              <Badge variant="success" size="sm">
                <CheckCircle2 className="w-3 h-3 mr-0.5" />
                {result.rowCount} ROWS RETURNED
              </Badge>
            </div>
          </div>
          <p className="text-xs text-zinc-600">
            Hasil pembacaan data kolom dan baris
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {result.rowCount === 0 ? (
            <div className="p-8 text-center bg-[#F7F7F2]">
              <p className="font-mono font-black text-xs uppercase text-zinc-700">
                QUERY SUCCESSFUL &bull; 0 ROWS RETURNED
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Tidak ada data yang memenuhi kondisi kriteria filter Anda.
              </p>
            </div>
          ) : (
            /* Dedicated horizontal scroll container to prevent page overflow */
            <div className="overflow-x-auto w-full max-h-[380px] overflow-y-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-[#FFD600] border-b-2 border-[#111111] sticky top-0 z-10">
                    <th className="p-2.5 font-black border-r-2 border-[#111111] text-zinc-700 text-[10px] w-12 text-center">
                      #
                    </th>
                    {result.columns.map((col) => (
                      <th
                        key={col.name}
                        className="p-2.5 font-black uppercase tracking-wider text-[#111111] border-r-2 border-[#111111] last:border-r-0 whitespace-nowrap"
                      >
                        <span>{col.name}</span>
                        <span className="block text-[9px] font-normal text-zinc-600 lowercase">
                          ({col.dataType})
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/20">
                  {result.rows.map((row, rowIndex) => {
                    const rowKey =
                      row["id"] !== undefined && row["id"] !== null
                        ? `row-id-${String(row["id"])}`
                        : `row-${rowIndex}`

                    return (
                      <tr
                        key={rowKey}
                        className={
                          rowIndex % 2 === 0
                            ? "bg-[#FFFFFF] hover:bg-[#FFF3A3]/40"
                            : "bg-[#F7F7F2] hover:bg-[#FFF3A3]/40"
                        }
                      >
                      <td className="p-2.5 text-center font-bold text-zinc-400 border-r border-[#111111]/20 text-[11px]">
                        {rowIndex + 1}
                      </td>
                      {result.columns.map((col) => {
                        const cellValue = row[col.name]
                        return (
                          <td
                            key={col.name}
                            className="p-2.5 border-r border-[#111111]/20 last:border-r-0 text-[#111111] whitespace-nowrap font-medium"
                          >
                            {cellValue === null ? (
                              <span className="text-zinc-400 italic font-normal">
                                NULL
                              </span>
                            ) : typeof cellValue === "boolean" ? (
                              cellValue ? (
                                "TRUE"
                              ) : (
                                "FALSE"
                              )
                            ) : (
                              String(cellValue)
                            )}
                          </td>
                        )
                      })}
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </div>

      <div className="p-3 bg-[#F7F7F2] border-t-2 border-[#111111] text-[11px] font-mono text-zinc-600 flex items-center justify-between">
        <span>Kolom tabel: {result.columns.map((c) => c.name).join(", ")}</span>
      </div>
    </Card>
  )
}
