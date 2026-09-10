import { type z } from "zod"
import {
  type StudentSchema,
  type LearningTopicSchema,
  type QueryStatusSchema,
  type QueryActivitySchema,
  type DashboardStatsSchema,
  type NextTopicSchema,
  type DashboardDataSchema,
} from "../schemas/dashboard.schema"

/**
 * Domain types extracted from Zod schemas (Single Source of Truth)
 */
export type Student = z.infer<typeof StudentSchema>
export type LearningTopic = z.infer<typeof LearningTopicSchema>
export type QueryStatus = z.infer<typeof QueryStatusSchema>
export type QueryActivity = z.infer<typeof QueryActivitySchema>
export type DashboardStats = z.infer<typeof DashboardStatsSchema>
export type NextTopic = z.infer<typeof NextTopicSchema>
export type DashboardData = z.infer<typeof DashboardDataSchema>
