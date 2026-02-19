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
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
        <body className="bg-bg-primary text-text-primary antialiased font-sans">
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
