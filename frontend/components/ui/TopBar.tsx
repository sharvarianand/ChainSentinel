'use client'

import { Bell, Search, User } from 'lucide-react'
import { useState } from 'react'

export function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, message: 'Critical disruption detected in Shanghai', time: '2 min ago', type: 'critical' },
    { id: 2, message: 'Risk assessment completed for 12 suppliers', time: '5 min ago', type: 'info' },
    { id: 3, message: 'Backup supplier activated successfully', time: '10 min ago', type: 'success' },
  ]

  return (
    <header className="h-16 bg-bg-secondary border-b border-border px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search disruptions, suppliers..."
            className="w-full pl-10 pr-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-red/50 transition-colors text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-bg-secondary border border-border rounded-xl shadow-xl overflow-hidden">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-text-primary">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 border-b border-border last:border-0 hover:bg-bg-tertiary transition-colors cursor-pointer"
                  >
                    <p className="text-sm text-text-primary">{notification.message}</p>
                    <p className="text-xs text-text-muted mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-accent-red/20 flex items-center justify-center">
            <User className="h-4 w-4 text-accent-red" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text-primary">Supply Chain Manager</p>
            <p className="text-xs text-text-muted">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
