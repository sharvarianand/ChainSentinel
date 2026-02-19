import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'text-accent-red'
    case 'high':
      return 'text-orange-400'
    case 'medium':
      return 'text-warning'
    case 'low':
      return 'text-success'
    default:
      return 'text-text-secondary'
  }
}

export function getSeverityBg(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'bg-accent-red/20 border-accent-red/30'
    case 'high':
      return 'bg-orange-500/20 border-orange-500/30'
    case 'medium':
      return 'bg-warning/20 border-warning/30'
    case 'low':
      return 'bg-success/20 border-success/30'
    default:
      return 'bg-bg-tertiary border-border'
  }
}

export function getTrustColor(score: number): string {
  if (score >= 70) return 'text-success'
  if (score >= 40) return 'text-warning'
  return 'text-accent-red'
}
