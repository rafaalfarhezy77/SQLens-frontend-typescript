import { z } from "zod"
import { toQueryId, toQueryExecutionId } from "../../../types/brand"

export const ExecuteQueryInputSchema = z.object({
  sql: z
    .string()
    .trim()
    .min(1, "Query SQL tidak boleh kosong")
    .max(2000, "Query terlalu panjang (maksimal 2000 karakter)"),
})

export const QueryIdSchema = z.string().transform((val) => toQueryId(val))
export const QueryExecutionIdSchema = z.string().transform((val) => toQueryExecutionId(val))

/**
 * Strongly typed cells and rows for dynamic query outputs (eliminates Record<string, any>)
 */
export const QueryCellSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
])

export const QueryRowSchema = z.record(z.string(), QueryCellSchema)

export const QueryColumnSchema = z.object({
  name: z.string(),
  dataType: z.string().default("text"),
})

export const QueryResultSchema = z.object({
  columns: z.array(QueryColumnSchema),
  rows: z.array(QueryRowSchema),
  rowCount: z.number().int().nonnegative(),
})

export const QueryStepTypeSchema = z.enum([
  "from",
  "join",
  "where",
  "groupBy",
  "having",
  "select",
  "orderBy",
  "limit",
])

export const QueryStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  type: QueryStepTypeSchema,
  title: z.string(),
  description: z.string(),
  details: z.string().optional(),
})

export const JoinDetailsSchema = z.object({
  leftTable: z.string(),
  rightTable: z.string(),
  leftKey: z.string(),
  rightKey: z.string(),
  joinType: z.string().default("INNER JOIN"),
})

export const QueryExecutionResponseSchema = z.object({
  executionId: z.string().transform((val) => toQueryExecutionId(val)),
  queryId: z.string().transform((val) => toQueryId(val)),
  sql: z.string(),
  status: z.enum(["success", "error"]),
  executionTimeMs: z.number().int().nonnegative(),
  result: QueryResultSchema.optional(),
  steps: z.array(QueryStepSchema).optional(),
  joinDetails: JoinDetailsSchema.optional(),
  error: z.string().optional(),
  hint: z.string().optional(),
})

export const QueryHistoryItemSchema = z.object({
  id: z.string().transform((val) => toQueryId(val)),
  sql: z.string(),
  status: z.enum(["success", "error"]),
  executedAt: z.string(),
  rowCount: z.number().int().nonnegative(),
})
