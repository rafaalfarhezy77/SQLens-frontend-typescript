import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

export const inputVariants = cva(
  "w-full bg-[#FFFFFF] text-[#111111] placeholder:text-zinc-400 font-medium border-2 transition-all focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-70",
  {
    variants: {
      variant: {
        default:
          "border-[#111111] shadow-neo-sm focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#FFD600] focus:shadow-neo",
        error:
          "border-[#EF4444] bg-red-50/20 text-red-900 shadow-[2px_2px_0px_#EF4444] focus:ring-2 focus:ring-red-400 focus:shadow-[4px_4px_0px_#EF4444]",
      },
      inputSize: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-3.5 text-sm",
        lg: "h-13 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
