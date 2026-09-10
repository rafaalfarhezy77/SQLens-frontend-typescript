import * as React from "react"
import { PlaygroundHeader } from "../features/playground/components/playground-header"
import { AvailableTables } from "../features/playground/components/available-tables"
import { SqlEditor } from "../features/playground/components/sql-editor"
import { QueryControls } from "../features/playground/components/query-controls"
import { QueryResult } from "../features/playground/components/query-result"
import { QueryExplanation } from "../features/playground/components/query-explanation"
import { QueryHistory } from "../features/playground/components/query-history"
import { ExecuteQueryInputSchema } from "../features/playground/schemas/query.schema"
import {
  executeQuery,
  getInitialQueryHistory,
} from "../features/playground/services/query.service"
import { type AsyncState } from "../types/async-state"
import {
  type QueryExecutionResponse,
  type QueryHistoryItem,
} from "../features/playground/types/query.types"
import { toQueryId } from "../types/brand"
import { Terminal } from "lucide-react"

interface PlaygroundPageProps {
  onNavigateDashboard: () => void
  onSignOut: () => void
}

const DEFAULT_QUERY = `SELECT name, score
FROM students
WHERE score >= 80;`

export function PlaygroundPage({
  onNavigateDashboard,
  onSignOut,
}: PlaygroundPageProps) {
  // Controlled SQL query state
  const [sql, setSql] = React.useState<string>(DEFAULT_QUERY)

  // Input validation error
  const [validationError, setValidationError] = React.useState<string | undefined>()

  // Discriminated union for query execution lifecycle
  const [executionState, setExecutionState] = React.useState<
    AsyncState<QueryExecutionResponse>
  >({
    status: "idle",
  })

  // Query execution history list
  const [history, setHistory] = React.useState<QueryHistoryItem[]>([])

  // Load initial mock history
  React.useEffect(() => {
    void getInitialQueryHistory().then((data) => {
      setHistory(data)
    })
  }, [])

  // Execute query handler with Zod input validation and async/await try/catch
  const handleRunQuery = async () => {
    // 1. Zod input runtime validation
    const validationResult = ExecuteQueryInputSchema.safeParse({ sql })

    if (!validationResult.success) {
      const issue = validationResult.error.issues[0]
      setValidationError(issue ? issue.message : "Format query tidak valid")
      return
    }

    setValidationError(undefined)
    setExecutionState({ status: "loading" })

    try {
      // 2. Simulated asynchronous execution
      const response = await executeQuery(validationResult.data)

      setExecutionState({
        status: "success",
        data: response,
      })

      // 3. Prepend to history
      const newHistoryItem: QueryHistoryItem = {
        id: toQueryId(`qry_hist_${Date.now()}`),
        sql: response.sql,
        status: response.status,
        executedAt: "Baru saja",
        rowCount: response.result?.rowCount ?? 0,
      }

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 4)])
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan internal saat mengeksekusi simulasi query."

      setExecutionState({
        status: "error",
        error: message,
      })
    }
  }

  // Clear action
  const handleClear = () => {
    setSql("")
    setValidationError(undefined)
    setExecutionState({ status: "idle" })
  }

  // Load query action from history
  const handleLoadQuery = (loadedSql: string) => {
    setSql(loadedSql)
    setValidationError(undefined)
  }

  // Map execution status for controls badge
  const getUiStatus = () => {
    if (executionState.status === "loading") return "loading"
    if (executionState.status === "error") return "error"
    if (executionState.status === "success") {
      return executionState.data.status === "error" ? "error" : "success"
    }
    return "idle"
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] flex flex-col justify-between text-[#111111]">
      {/* Top Navigation */}
      <PlaygroundHeader
        onNavigateDashboard={onNavigateDashboard}
        onSignOut={onSignOut}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
        {/* Page Title Banner */}
        <section
          aria-labelledby="playground-title"
          className="bg-[#FFFFFF] border-4 border-[#111111] shadow-neo p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-1">
                INTERACTIVE SQL EXECUTION &bull; QUERY TUTOR
              </p>
              <h1
                id="playground-title"
                className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]"
              >
                SQL PLAYGROUND.
              </h1>
              <p className="text-sm sm:text-base font-medium text-zinc-700 mt-2 max-w-2xl">
                Tulis perintah query basis data, jalankan pada sandbox, dan amati langsung bagaimana data dipindai, difilter, dan digabungkan (<strong>Query-to-Visual Explanation</strong>).
              </p>
            </div>
          </div>
        </section>

        {/* Available Tables Schema Reference */}
        <section aria-label="Skema Tabel Tersedia">
          <AvailableTables onSelectTemplate={handleLoadQuery} />
        </section>

        {/* SQL Editor & Controls Section */}
        <section aria-label="Editor SQL dan Tombol Eksekusi" className="space-y-4">
          <SqlEditor
            value={sql}
            onChange={(val) => {
              setSql(val)
              if (validationError) setValidationError(undefined)
            }}
            validationError={validationError}
            disabled={executionState.status === "loading"}
          />

          <QueryControls
            status={getUiStatus()}
            onRun={() => void handleRunQuery()}
            onClear={handleClear}
          />
        </section>

        {/* 2-Column Section: Query Result Table & Query-to-Visual Explanation */}
        <section
          aria-label="Hasil Eksekusi dan Visualisasi Alur Query"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Result Table (7 cols) */}
          <div className="lg:col-span-7">
            <QueryResult
              result={
                executionState.status === "success" && executionState.data.result
                  ? executionState.data.result
                  : undefined
              }
              isIdle={executionState.status === "idle"}
              executionTimeMs={
                executionState.status === "success"
                  ? executionState.data.executionTimeMs
                  : undefined
              }
            />
          </div>

          {/* Explanation Pipeline (5 cols) */}
          <div className="lg:col-span-5">
            <QueryExplanation
              steps={
                executionState.status === "success"
                  ? executionState.data.steps
                  : undefined
              }
              joinDetails={
                executionState.status === "success"
                  ? executionState.data.joinDetails
                  : undefined
              }
              errorMessage={
                executionState.status === "error"
                  ? executionState.error
                  : executionState.status === "success" && executionState.data.status === "error"
                  ? executionState.data.error
                  : undefined
              }
              errorHint={
                executionState.status === "success" && executionState.data.status === "error"
                  ? executionState.data.hint
                  : undefined
              }
              isIdle={executionState.status === "idle"}
            />
          </div>
        </section>

        {/* Query History with DOM Event Delegation */}
        <section aria-label="Riwayat Eksekusi Query">
          <QueryHistory history={history} onLoadQuery={handleLoadQuery} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[#111111] bg-[#FFFFFF] px-4 py-4 text-center text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold text-zinc-700">
            &copy; 2026 SQLens — Web-Based Interactive SQL Execution &amp; Query Tutor.
          </p>
          <p className="font-semibold text-zinc-500 text-[11px] flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-[#FFD600]" />
            SQL Playground &bull; Page 3 Active
          </p>
        </div>
      </footer>
    </div>
  )
}
