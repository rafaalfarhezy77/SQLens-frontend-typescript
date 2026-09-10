import { z } from "zod"
import { toUserId } from "../../../types/brand"

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid (contoh: student@campus.ac.id)"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
  rememberMe: z.boolean().default(false),
})

export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .min(3, "Nama lengkap minimal 3 karakter")
      .max(60, "Nama lengkap maksimal 60 karakter"),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid (contoh: student@campus.ac.id)"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(/[0-9]/, "Password harus mengandung minimal 1 angka"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "Anda wajib menyetujui Ketentuan Layanan & Kebijakan Privasi SQLens",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok dengan password",
    path: ["confirmPassword"],
  })

export const AuthUserSchema = z.object({
  id: z.string().transform((val) => toUserId(val)),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["student", "educator"]).default("student"),
})

export const AuthResponseSchema = z.object({
  user: AuthUserSchema,
  token: z.string().min(1),
  message: z.string(),
})
