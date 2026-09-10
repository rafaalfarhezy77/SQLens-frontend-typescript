import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

export const cardVariants = cva(
  "border-3 border-[#111111] transition-all text-[#111111]",
  {
    variants: {
      variant: {
        default: "bg-[#FFFFFF] shadow-neo",
        yellow: "bg-[#FFD600] shadow-neo",
        muted: "bg-[#F7F7F2] shadow-neo-sm",
        outlined: "bg-[#FFFFFF] border-2 border-dashed border-[#111111] shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-5 pb-3", className)}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        "font-black uppercase tracking-tight text-lg sm:text-xl leading-tight text-[#111111]",
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-xs sm:text-sm font-medium text-zinc-600", className)}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
  )
})
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-5 pt-0 border-t-2 border-[#111111]/20 mt-4", className)}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"
