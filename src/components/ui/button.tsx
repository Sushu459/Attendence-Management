import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft hover:shadow-card transition-smooth",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-smooth",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-smooth",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-smooth",
        ghost: "hover:bg-accent hover:text-accent-foreground transition-smooth",
        link: "text-primary underline-offset-4 hover:underline transition-smooth",
        success: "bg-gradient-success text-success-foreground hover:opacity-90 shadow-success transition-smooth",
        warning: "bg-gradient-warning text-warning-foreground hover:opacity-90 transition-smooth",
        hero: "bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-card hover:shadow-lg transform hover:scale-105 transition-bounce font-semibold",
        reset: "bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground border border-border transition-smooth",
        accent: "bg-gradient-accent text-accent-foreground hover:opacity-90 shadow-accent hover:shadow-lg transform hover:scale-105 transition-bounce font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
