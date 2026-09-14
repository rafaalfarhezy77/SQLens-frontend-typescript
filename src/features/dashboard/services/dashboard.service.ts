import { DashboardDataSchema } from "../schemas/dashboard.schema"
import { type DashboardData } from "../types/dashboard.types"
import { type StudentId } from "../../../types/brand"

/**
 * Asynchronous service for fetching dashboard data using native Fetch API.
 * Requests data from `/api/dashboard`, treats the stream payload as `unknown`,
 * and validates it with Zod runtime parse before returning strongly typed data.
 */
export async function getDashboardData(
  _studentId?: StudentId,
  shouldFail: boolean = false
): Promise<DashboardData> {
  const queryParam = shouldFail ? "?fail=true" : ""
  const response = await fetch(`/api/dashboard${queryParam}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(
      errorBody.message ||
        "Gagal terhubung dengan server akademik SQLens. Periksa koneksi internet Anda atau coba kembali."
    )
  }

  // Runtime validation of external data using Zod
  const json: unknown = await response.json()
  const validatedDashboard = DashboardDataSchema.parse(json)
  return validatedDashboard
}
