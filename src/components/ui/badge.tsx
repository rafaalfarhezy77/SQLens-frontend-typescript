import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border-2 border-[#111111] shadow-neo-sm select-none",
  {
    variants: {
      variant: {
        yellow: "bg-[#FFD600] text-[#111111]",
        neutral: "bg-[#FFFFFF] text-[#111111]",
        success: "bg-[#10B981] text-white",
        error: "bg-[#EF4444] text-white",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.2",
        md: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "yellow",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  )
}
