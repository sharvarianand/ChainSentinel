'use client'

import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FlaskConical, 
  Users, 
  FileText, 
  ShieldCheck, 
  BrainCircuit,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Simulations', href: '/simulations', icon: FlaskConical },
  { name: 'Suppliers', href: '/suppliers', icon: Users },
  { name: 'Incident Log', href: '/incidents', icon: FileText },
  { name: 'Compliance', href: '/compliance', icon: ShieldCheck },
  { name: 'Learning Insights', href: '/learning', icon: BrainCircuit },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-bg-secondary border-r border-border flex flex-col transition-all duration-300 z-50',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-accent-red" />
            <span className="font-display font-bold text-xl text-text-primary">ChainSentinel</span>
          </Link>
        )}
        {collapsed && (
          <Activity className="h-8 w-8 text-accent-red mx-auto" />
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-accent-red/10 text-accent-red border-l-2 border-accent-red'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-2 border-t border-border">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-200',
            collapsed && 'justify-center'
          )}
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-bg-tertiary border border-border rounded-full p-1 text-text-secondary hover:text-text-primary transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  )
}
