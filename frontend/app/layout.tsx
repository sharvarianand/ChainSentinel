import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/ui/Navbar'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export const metadata: Metadata = {
  title: 'ChainSentinel - Autonomous Supply Chain Defense',
  description: 'Detect. Decide. Resolve. AI-powered supply chain resilience.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#e63946', // accent-red
          colorBackground: '#111827', // bg-secondary
          colorInputBackground: '#1a2235', // bg-tertiary
          colorInputText: '#ffffff',
          colorText: '#ffffff',
          colorTextSecondary: '#9ca3af', // text-muted
          borderRadius: '0.5rem',
          colorDanger: '#e63946',
          colorSuccess: '#22c55e',
          colorWarning: '#f59e0b',
        },
        elements: {
          card: 'border border-[#1f2937] shadow-[0_0_25px_rgba(0,0,0,0.5)]',
          userButtonPopoverCard: 'border border-[#374151] bg-[#111827] shadow-[0_0_30px_rgba(0,0,0,0.8)]',
          userButtonPopoverActionButton: 'hover:bg-white/5',
          userButtonPopoverActionButtonText: 'text-white',
          userButtonPopoverFooter: 'hidden',
          badge: 'bg-accent-red/20 text-accent-red',
        }
      }}
    >
      <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
        <body className="bg-bg-primary text-text-primary antialiased font-sans flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
