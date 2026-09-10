import { AuthResponseSchema } from "../schemas/auth.schema"
import { type AuthResponse, type LoginInput, type RegisterInput } from "../types/auth.types"

/**
 * Utility helper to simulate network latency with async/await
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

/**
 * Simulated backend authentication API.
 * Uses realistic delays, mock database validation, and Zod runtime schema verification.
 */
export async function login(input: LoginInput): Promise<AuthResponse> {
  await delay(900)

  // Simulation of bad credentials trigger
  if (input.email.includes("fail") || input.password === "wrongpassword") {
    throw new Error("Kombinasi email atau password salah. Silakan coba lagi.")
  }

  // Raw mock payload from simulated server
  const rawServerPayload = {
    user: {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: input.email.split("@")[0] ?? "SQL Student",
      email: input.email,
      role: "student",
    },
    token: `sqlens_jwt_${Math.random().toString(36).substring(2)}`,
    message: "Otentikasi berhasil. Selamat datang kembali di SQLens!",
  }

  // Runtime validation using Zod parse as mandated by requirements
  const validatedResponse = AuthResponseSchema.parse(rawServerPayload)
  return validatedResponse
}

/**
 * Simulated backend user registration API.
 */
export async function register(input: RegisterInput): Promise<AuthResponse> {
  await delay(1100)

  // Simulation of duplicate account error
  if (input.email.includes("exists")) {
    throw new Error("Email ini sudah terdaftar dalam sistem akademik SQLens.")
  }

  // Raw mock payload from simulated server
  const rawServerPayload = {
    user: {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: input.fullName,
      email: input.email,
      role: "student",
    },
    token: `sqlens_jwt_${Math.random().toString(36).substring(2)}`,
    message: "Pendaftaran berhasil! Akun Anda siap digunakan untuk latihan SQL.",
  }

  // Runtime validation using Zod parse as mandated by requirements
  const validatedResponse = AuthResponseSchema.parse(rawServerPayload)
  return validatedResponse
}
