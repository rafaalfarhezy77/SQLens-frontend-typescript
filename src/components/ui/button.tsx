import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-bold tracking-wider uppercase border-2 border-[#111111] select-none cursor-pointer transition-all duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none disabled:shadow-neo",
  {
    variants: {
      variant: {
        primary:
          "bg-[#FFD600] text-[#111111] shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#111111] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        secondary:
          "bg-[#FFFFFF] text-[#111111] shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#111111] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        ghost:
          "bg-transparent text-[#111111] border-2 border-transparent hover:border-[#111111] hover:bg-[#FFF3A3]/50 active:translate-x-[2px] active:translate-y-[2px]",
        danger:
          "bg-[#EF4444] text-white shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#111111] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base font-extrabold",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
