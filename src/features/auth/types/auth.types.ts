import { type z } from "zod"
import {
  type LoginSchema,
  type RegisterSchema,
  type AuthUserSchema,
  type AuthResponseSchema,
} from "../schemas/auth.schema"

/**
 * Inferred input types from Zod schemas (Single Source of Truth)
 */
export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type AuthUser = z.infer<typeof AuthUserSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>

/**
 * Authentication display modes
 */
export type AuthMode = "login" | "register"
