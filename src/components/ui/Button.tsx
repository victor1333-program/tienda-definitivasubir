import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 transform",
  {
    variants: {
      variant: {
        default: "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg active:bg-orange-700 focus:ring-orange-500",
        destructive: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg active:bg-red-700 focus:ring-red-500",
        outline: "border border-orange-300 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-500 hover:shadow-md active:bg-orange-100",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md active:bg-gray-300 focus:ring-gray-500",
        ghost: "text-gray-600 hover:bg-orange-50 hover:text-orange-600 active:bg-orange-100",
        link: "text-orange-600 underline-offset-4 hover:underline hover:text-orange-700",
        lovilike: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl active:from-orange-700 active:to-orange-800 focus:ring-orange-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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