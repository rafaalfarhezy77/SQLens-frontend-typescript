import { z } from "zod"
import { toStudentId, toLearningTopicId, toQueryId } from "../../../types/brand"

export const StudentSchema = z.object({
  id: z.string().transform((val) => toStudentId(val)),
  name: z.string().min(1, "Nama mahasiswa tidak boleh kosong"),
  email: z.string().email("Format email tidak valid"),
  university: z.string().default("Universitas Indonesia"),
  semester: z.number().int().positive().default(3),
})

export const LearningTopicSchema = z.object({
  id: z.string().transform((val) => toLearningTopicId(val)),
  name: z.string().min(1),
  description: z.string().default(""),
  progress: z.number().int().min(0).max(100),
  completed: z.boolean().default(false),
  category: z.string().default("DML"),
})

export const QueryStatusSchema = z.enum(["success", "error"])

export const QueryActivitySchema = z.object({
  id: z.string().transform((val) => toQueryId(val)),
  sql: z.string().min(1),
  status: QueryStatusSchema,
  executedAt: z.string(),
  executionTimeMs: z.number().int().nonnegative().optional(),
  affectedRows: z.number().int().nonnegative().optional(),
})

export const DashboardStatsSchema = z.object({
  queriesRun: z.number().int().nonnegative(),
  completedTopics: z.number().int().nonnegative(),
  totalTopics: z.number().int().positive(),
  streakDays: z.number().int().nonnegative(),
})

export const NextTopicSchema = z.object({
  id: z.string().transform((val) => toLearningTopicId(val)),
  name: z.string().min(1),
  description: z.string(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  estimatedMinutes: z.number().int().positive(),
})

export const DashboardDataSchema = z.object({
  student: StudentSchema,
  stats: DashboardStatsSchema,
  learningTopics: z.array(LearningTopicSchema),
  nextTopic: NextTopicSchema,
  recentActivities: z.array(QueryActivitySchema),
})
