import * as React from "react"
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { RegisterSchema } from "../schemas/auth.schema"
import { register } from "../services/auth.service"
import { type AsyncState } from "../../../types/async-state"
import { type AuthResponse, type RegisterInput } from "../types/auth.types"

interface RegisterFormProps {
  onSwitchToLogin: () => void
  onNavigateToDashboard?: () => void
}

type FormErrors = Partial<Record<keyof RegisterInput, string>>

export function RegisterForm({ onSwitchToLogin, onNavigateToDashboard }: RegisterFormProps) {
  // Controlled form state
  const [formData, setFormData] = React.useState<RegisterInput>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  // Specific validation errors state
  const [errors, setErrors] = React.useState<FormErrors>({})

  // Strict discriminated union async state for network/service call
  const [asyncState, setAsyncState] = React.useState<AsyncState<AuthResponse>>({
    status: "idle",
  })

  // Show/hide password toggles
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear inline error when typing
    if (errors[name as keyof RegisterInput]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 1. Client-side Zod runtime validation
    const validationResult = RegisterSchema.safeParse(formData)

    if (!validationResult.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0] as keyof RegisterInput | undefined
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    // Clear previous errors
    setErrors({})

    // 2. Structured try/catch with async/await
    try {
      setAsyncState({ status: "loading" })

      const response = await register(validationResult.data)

      setAsyncState({
        status: "success",
        data: response,
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal membuat akun SQLens. Silakan periksa kembali data Anda."

      setAsyncState({
        status: "error",
        error: message,
      })
    }
  }

  // Render Success State (Page 2 not implemented yet)
  if (asyncState.status === "success") {
    return (
      <div 
        className="p-6 bg-[#FFFFFF] border-3 border-[#111111] shadow-neo space-y-4 animate-in fade-in"
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center gap-2">
          <Badge variant="success" size="lg" className="font-mono">
            <CheckCircle2 className="w-4 h-4" /> REGISTRATION COMPLETE
          </Badge>
        </div>

        <div className="border-2 border-[#111111] p-4 bg-[#FFF3A3]/60 space-y-2 font-mono text-xs">
          <p className="font-bold text-[#111111] text-sm">{asyncState.data.message}</p>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#111111]">
            <div>
              <span className="text-zinc-600 block">Student Name:</span>
              <span className="font-bold text-zinc-900">{asyncState.data.user.name}</span>
            </div>
            <div>
              <span className="text-zinc-600 block">Generated User ID:</span>
              <span className="font-bold text-zinc-900 bg-white px-1 border border-zinc-400 inline-block">
                {asyncState.data.user.id}
              </span>
            </div>
          </div>
          <div className="pt-1">
            <span className="text-zinc-600 block">Assigned Token:</span>
            <span className="font-mono text-[11px] truncate block text-zinc-800 bg-white px-1 border border-zinc-400">
              {asyncState.data.token}
            </span>
          </div>
        </div>

        {onNavigateToDashboard ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onNavigateToDashboard}
            className="flex items-center justify-center gap-2"
          >
            BUKA LEARNING DASHBOARD <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="primary"
            fullWidth
            onClick={onSwitchToLogin}
          >
            Lanjut ke Halaman Sign In
          </Button>
        )}
      </div>
    )
  }

  const isLoading = asyncState.status === "loading"

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
      {/* Error alert banner */}
      {asyncState.status === "error" && (
        <div
          className="p-3 bg-red-100 border-2 border-[#EF4444] shadow-neo-sm flex items-start gap-2.5 text-xs text-red-900 font-bold"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
          <div>
            <p className="font-black uppercase tracking-wide">Pendaftaran Gagal</p>
            <p className="font-medium mt-0.5">{asyncState.error}</p>
          </div>
        </div>
      )}

      {/* Full Name field */}
      <div className="space-y-1">
        <label
          htmlFor="reg-fullName"
          className="block text-xs font-bold uppercase tracking-wider text-[#111111]"
        >
          Nama Lengkap Mahasiswa
        </label>
        <div className="relative">
          <Input
            id="reg-fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            disabled={isLoading}
            placeholder="Contoh: Budi Pratama"
            value={formData.fullName}
            onChange={handleInputChange}
            variant={errors.fullName ? "error" : "default"}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "reg-name-error" : undefined}
            className="pl-9"
          />
          <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.fullName && (
          <p id="reg-name-error" className="text-xs font-bold text-[#EF4444]">
            &bull; {errors.fullName}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-1">
        <label
          htmlFor="reg-email"
          className="block text-xs font-bold uppercase tracking-wider text-[#111111]"
        >
          Email Kampus / Pribadi
        </label>
        <div className="relative">
          <Input
            id="reg-email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
            placeholder="budi@campus.ac.id"
            value={formData.email}
            onChange={handleInputChange}
            variant={errors.email ? "error" : "default"}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "reg-email-error" : undefined}
            className="pl-9"
          />
          <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.email && (
          <p id="reg-email-error" className="text-xs font-bold text-[#EF4444]">
            &bull; {errors.email}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor="reg-password"
            className="block text-xs font-bold uppercase tracking-wider text-[#111111]"
          >
            Password
          </label>
          <span className="text-[10px] text-zinc-500 font-medium">Min. 8 kar + angka</span>
        </div>
        <div className="relative">
          <Input
            id="reg-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            disabled={isLoading}
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            value={formData.password}
            onChange={handleInputChange}
            variant={errors.password ? "error" : "default"}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "reg-password-error" : undefined}
            className="pl-9 pr-10"
          />
          <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black p-1 focus:outline-none focus:ring-1 focus:ring-black"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p id="reg-password-error" className="text-xs font-bold text-[#EF4444]">
            &bull; {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password field */}
      <div className="space-y-1">
        <label
          htmlFor="reg-confirmPassword"
          className="block text-xs font-bold uppercase tracking-wider text-[#111111]"
        >
          Konfirmasi Password
        </label>
        <div className="relative">
          <Input
            id="reg-confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            disabled={isLoading}
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            variant={errors.confirmPassword ? "error" : "default"}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "reg-confirm-error" : undefined}
            className="pl-9 pr-10"
          />
          <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Lihat konfirmasi password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black p-1 focus:outline-none focus:ring-1 focus:ring-black"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="reg-confirm-error" className="text-xs font-bold text-[#EF4444]">
            &bull; {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Terms agreement checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            disabled={isLoading}
            onChange={handleInputChange}
            aria-invalid={Boolean(errors.agreeTerms)}
            aria-describedby={errors.agreeTerms ? "reg-terms-error" : undefined}
            className="w-4 h-4 mt-0.5 accent-[#FFD600] border-2 border-[#111111] cursor-pointer shrink-0"
          />
          <span className="text-xs text-zinc-800 leading-snug font-medium">
            Saya menyetujui Ketentuan Layanan &amp; Kebijakan Privasi SQLens untuk keperluan belajar basis data.
          </span>
        </label>
        {errors.agreeTerms && (
          <p id="reg-terms-error" className="text-xs font-bold text-[#EF4444] mt-1 pl-6">
            &bull; {errors.agreeTerms}
          </p>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isLoading}
        className="mt-2"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent animate-spin inline-block"></span>
            CREATING ACCOUNT...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            CREATE ACCOUNT <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>

      {/* Footer switcher note */}
      <div className="pt-2 text-center border-t border-zinc-300">
        <p className="text-xs text-zinc-600 font-medium">
          Sudah memiliki akun SQLens?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-[#111111] underline hover:bg-[#FFD600] px-1 transition-colors"
          >
            Masuk ke Akun Anda
          </button>
        </p>
      </div>
    </form>
  )
}
