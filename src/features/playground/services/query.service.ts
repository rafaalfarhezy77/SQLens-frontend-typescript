import { QueryExecutionResponseSchema, QueryHistoryItemSchema } from "../schemas/query.schema"
import {
  type ExecuteQueryInput,
  type QueryExecutionResponse,
  type QueryHistoryItem,
} from "../types/query.types"

/**
 * Retrieves the initial query history list using native Fetch API.
 * Validates each item against QueryHistoryItemSchema.
 */
export async function getInitialQueryHistory(): Promise<QueryHistoryItem[]> {
  const response = await fetch("/api/query/history", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Gagal mengambil riwayat query dari server.")
  }

  const json: unknown = await response.json()
  if (!Array.isArray(json)) {
    throw new Error("Format respon riwayat query tidak valid.")
  }

  return json.map((raw) => QueryHistoryItemSchema.parse(raw))
}

/**
 * SQL execution service using native Fetch API with async/await.
 * Sends POST /api/query/execute and validates response using QueryExecutionResponseSchema.
 */
export async function executeQuery(
  input: ExecuteQueryInput
): Promise<QueryExecutionResponse> {
  const response = await fetch("/api/query/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(
      errorBody.message || "Terjadi kesalahan internal saat mengeksekusi query."
    )
  }

  const json: unknown = await response.json()
  const validatedResponse = QueryExecutionResponseSchema.parse(json)
  return validatedResponse
}
