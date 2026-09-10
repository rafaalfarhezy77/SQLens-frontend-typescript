import * as React from "react"
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { LoginSchema } from "../schemas/auth.schema"
import { login } from "../services/auth.service"
import { type AsyncState } from "../../../types/async-state"
import { type AuthResponse, type LoginInput } from "../types/auth.types"

interface LoginFormProps {
  onSwitchToRegister: () => void
  onNavigateToDashboard?: () => void
}

type FormErrors = Partial<Record<keyof LoginInput, string>>

export function LoginForm({ onSwitchToRegister, onNavigateToDashboard }: LoginFormProps) {
  // Controlled form state
  const [formData, setFormData] = React.useState<LoginInput>({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Specific validation errors state
  const [errors, setErrors] = React.useState<FormErrors>({})

  // Strict discriminated union async state for network/service call
  const [asyncState, setAsyncState] = React.useState<AsyncState<AuthResponse>>({
    status: "idle",
  })

  // Show/hide password toggle
  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear inline error when typing
    if (errors[name as keyof LoginInput]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 1. Client-side Zod runtime validation
    const validationResult = LoginSchema.safeParse(formData)

    if (!validationResult.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0] as keyof LoginInput | undefined
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

      const response = await login(validationResult.data)

      setAsyncState({
        status: "success",
        data: response,
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan sistem saat mencoba masuk. Silakan coba kembali."

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
            <CheckCircle2 className="w-4 h-4" /> LOGIN SUCCESSFUL
          </Badge>
        </div>

        <div className="border-2 border-[#111111] p-4 bg-[#FFF3A3]/60 space-y-2 font-mono text-xs">
          <p className="font-bold text-[#111111] text-sm">{asyncState.data.message}</p>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#111111]">
            <div>
              <span className="text-zinc-600 block">User Name:</span>
              <span className="font-bold text-zinc-900">{asyncState.data.user.name}</span>
            </div>
            <div>
              <span className="text-zinc-600 block">Nominal User ID:</span>
              <span className="font-bold text-zinc-900 bg-white px-1 border border-zinc-400 inline-block">
                {asyncState.data.user.id}
              </span>
            </div>
          </div>
          <div className="pt-1">
            <span className="text-zinc-600 block">Active Token:</span>
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
          <p className="text-xs font-semibold text-zinc-700 leading-relaxed bg-[#F7F7F2] p-3 border-2 border-dashed border-[#111111]">
            &bull; <strong>Notice:</strong> Dashboard telah aktif (Page 2).
          </p>
        )}

        <Button
          variant="secondary"
          fullWidth
          onClick={() => {
            setAsyncState({ status: "idle" })
            setFormData({ email: "", password: "", rememberMe: false })
          }}
        >
          Masuk dengan Akun Lain
        </Button>
      </div>
    )
  }

  const isLoading = asyncState.status === "loading"

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Error alert banner */}
      {asyncState.status === "error" && (
        <div
          className="p-3 bg-red-100 border-2 border-[#EF4444] shadow-neo-sm flex items-start gap-2.5 text-xs text-red-900 font-bold"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
          <div>
            <p className="font-black uppercase tracking-wide">Autentikasi Gagal</p>
            <p className="font-medium mt-0.5">{asyncState.error}</p>
          </div>
        </div>
      )}

      {/* Email field */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="block text-xs font-bold uppercase tracking-wider text-[#111111]"
        >
          Email Mahasiswa / Pengguna
        </label>
        <div className="relative">
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
            placeholder="nama@campus.ac.id"
            value={formData.email}
            onChange={handleInputChange}
            variant={errors.email ? "error" : "default"}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className="pl-9"
          />
          <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.email && (
          <p id="login-email-error" className="text-xs font-bold text-[#EF4444] flex items-center gap-1">
            &bull; {errors.email}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="block text-xs font-bold uppercase tracking-wider text-[#111111]"
          >
            Password
          </label>
          <span className="text-[11px] text-zinc-500 font-medium">Min. 8 karakter</span>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            disabled={isLoading}
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            value={formData.password}
            onChange={handleInputChange}
            variant={errors.password ? "error" : "default"}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "login-password-error" : undefined}
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
          <p id="login-password-error" className="text-xs font-bold text-[#EF4444] flex items-center gap-1">
            &bull; {errors.password}
          </p>
        )}
      </div>

      {/* Remember me checkbox */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            disabled={isLoading}
            onChange={handleInputChange}
            className="w-4 h-4 accent-[#FFD600] border-2 border-[#111111] cursor-pointer"
          />
          <span className="text-xs font-bold text-[#111111]">Ingat saya di perangkat ini</span>
        </label>
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
            SIGNING IN...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            SIGN IN <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>

      {/* Footer switcher note */}
      <div className="pt-2 text-center border-t border-zinc-300">
        <p className="text-xs text-zinc-600 font-medium">
          Belum punya akun SQLens?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-[#111111] underline hover:bg-[#FFD600] px-1 transition-colors"
          >
            Buat Akun Baru
          </button>
        </p>
      </div>
    </form>
  )
}
