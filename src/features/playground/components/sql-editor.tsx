import { Terminal, AlertCircle } from "lucide-react"

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  validationError?: string
  disabled?: boolean
}

export function SqlEditor({
  value,
  onChange,
  validationError,
  disabled = false,
}: SqlEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="sql-editor-textarea"
          className="text-xs font-mono font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5"
        >
          <Terminal className="w-4 h-4 text-[#111111]" />
          <span>SQL QUERY EDITOR</span>
        </label>
        <span className="text-[11px] font-mono text-zinc-500 font-bold">
          {value.length} / 2000 KARAKTER
        </span>
      </div>

      {/* Editor Frame */}
      <div className="border-4 border-[#111111] bg-[#FFFFFF] shadow-neo overflow-hidden">
        {/* Mock Top bar of Editor */}
        <div className="bg-[#111111] text-[#FFFFFF] px-3.5 py-1.5 flex items-center justify-between font-mono text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FFD600] inline-block border border-black"></span>
            <span className="w-2.5 h-2.5 bg-[#FFFFFF] inline-block border border-black"></span>
            <span className="w-2.5 h-2.5 bg-[#EF4444] inline-block border border-black"></span>
            <span className="text-zinc-400 ml-1 text-[11px]">sandbox.sql</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[#FFD600] font-bold">
            DIALECT: POSTGRESQL / ANSI
          </span>
        </div>

        {/* Textarea */}
        <textarea
          id="sql-editor-textarea"
          name="sql"
          rows={6}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="-- Ketik query SQL Anda di sini (contoh: SELECT * FROM students;)"
          spellCheck={false}
          className="w-full p-4 font-mono text-sm sm:text-base leading-relaxed text-[#111111] bg-[#FFFFFF] placeholder:text-zinc-400 focus:outline-none focus:bg-[#FFF3A3]/20 transition-colors resize-y disabled:bg-zinc-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-2.5 bg-red-100 border-2 border-[#EF4444] text-xs font-bold text-red-900 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  )
}
