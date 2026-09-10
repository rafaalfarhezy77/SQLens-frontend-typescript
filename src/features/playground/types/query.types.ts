import { type z } from "zod"
import {
  type ExecuteQueryInputSchema,
  type QueryCellSchema,
  type QueryRowSchema,
  type QueryColumnSchema,
  type QueryResultSchema,
  type QueryStepTypeSchema,
  type QueryStepSchema,
  type JoinDetailsSchema,
  type QueryExecutionResponseSchema,
  type QueryHistoryItemSchema,
} from "../schemas/query.schema"

export type ExecuteQueryInput = z.infer<typeof ExecuteQueryInputSchema>
export type QueryCell = z.infer<typeof QueryCellSchema>
export type QueryRow = z.infer<typeof QueryRowSchema>
export type QueryColumn = z.infer<typeof QueryColumnSchema>
export type QueryResult = z.infer<typeof QueryResultSchema>
export type QueryStepType = z.infer<typeof QueryStepTypeSchema>
export type QueryStep = z.infer<typeof QueryStepSchema>
export type JoinDetails = z.infer<typeof JoinDetailsSchema>
export type QueryExecutionResponse = z.infer<typeof QueryExecutionResponseSchema>
export type QueryHistoryItem = z.infer<typeof QueryHistoryItemSchema>
