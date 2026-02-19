import { cn, getSeverityBg } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'severity'
  severity?: 'critical' | 'high' | 'medium' | 'low'
}

export function Badge({ className, variant = 'default', severity, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-bg-tertiary text-text-secondary border border-border',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    danger: 'bg-accent-red/20 text-accent-red border border-accent-red/30',
    severity: severity ? getSeverityBg(severity) : 'bg-bg-tertiary border border-border',
  }

  const severityTextColors: Record<string, string> = {
    critical: 'text-accent-red',
    high: 'text-orange-400',
    medium: 'text-warning',
    low: 'text-success',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        variant === 'severity' && severity && severityTextColors[severity],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
