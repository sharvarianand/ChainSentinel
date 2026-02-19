import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-accent-red text-white shadow-[0_0_20px_rgba(230,57,70,0.3)] hover:shadow-[0_0_40px_rgba(230,57,70,0.5)] hover:-translate-y-0.5',
        ghost: 'bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40',
        outline: 'border border-accent-red text-accent-red hover:bg-accent-red/10',
        secondary: 'bg-bg-tertiary text-text-primary hover:bg-bg-secondary border border-border',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
}

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(clsx(buttonVariants({ variant, size, className })))}
      {...props}
    >
      {children}
    </button>
  )
}
