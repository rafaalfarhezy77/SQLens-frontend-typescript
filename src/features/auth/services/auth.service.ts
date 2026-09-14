import { AuthResponseSchema } from "../schemas/auth.schema"
import { type AuthResponse, type LoginInput, type RegisterInput } from "../types/auth.types"

/**
 * Authentication service using native Fetch API with async/await
 * and Zod runtime schema verification.
 */
export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(
      errorBody.message || "Kombinasi email atau password salah. Silakan coba lagi."
    )
  }

  const json: unknown = await response.json()
  const validatedResponse = AuthResponseSchema.parse(json)
  return validatedResponse
}

/**
 * User registration service using native Fetch API with async/await
 * and Zod runtime schema verification.
 */
export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(
      errorBody.message || "Gagal mendaftarkan akun. Silakan coba kembali."
    )
  }

  const json: unknown = await response.json()
  const validatedResponse = AuthResponseSchema.parse(json)
  return validatedResponse
}
