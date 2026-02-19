'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const dashboardLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Suppliers', href: '/suppliers' },
  { name: 'Simulations', href: '/simulations' },
  { name: 'Incidents', href: '/incidents' },
  { name: 'Compliance', href: '/compliance' },
  { name: 'Learning', href: '/learning' },
]

const landingLinks = [
  { name: 'Vision', href: '#vision' },
  { name: 'Features', href: '#features' },
  { name: 'Our Network', href: '#network' },
]

export function Navbar() {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const navLinks = isLandingPage ? landingLinks : dashboardLinks

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-bg-primary/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 sm:px-12 transition-all duration-300">
      {/* Cinematic Gradient Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-red/50 to-transparent" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group relative z-10">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-accent-red rounded-lg opacity-20 group-hover:opacity-100 blur-[8px] transition-all duration-500" />
          <div className="relative w-10 h-10 bg-accent-red rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(230,57,70,0.2)] group-hover:scale-105 transition-transform duration-300 border border-white/10">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
        </div>
        <span className="text-white font-space-grotesk font-bold text-xl tracking-tighter uppercase whitespace-nowrap">
          Chain<span className="text-accent-red drop-shadow-[0_0_8px_rgba(230,57,70,0.8)]">Sentinel</span>
        </span>
      </Link>

      {/* Nav Links */}

      {/* Right Action */}
      <div className="flex items-center gap-6"> {/* Increased gap for separation */}

        {/* Nav Links - Now here on the right */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 mr-4">
          {navLinks.map((link) => {
            const isActive = !isLandingPage && (
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href))
            )

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 overflow-hidden group/link ${isActive
                  ? 'text-white font-bold bg-white/5 border border-accent-red/30 shadow-[0_0_15px_rgba(230,57,70,0.15)]'
                  : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent-red shadow-[0_0_10px_#E63946]" />}
              </Link>
            )
          })}
        </div>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="hidden sm:block px-6 py-2.5 bg-accent-red/90 text-white text-[11px] font-mono uppercase tracking-[0.2em] rounded-md border border-accent-red hover:bg-accent-red hover:shadow-[0_0_25px_rgba(230,57,70,0.6)] hover:scale-105 active:scale-95 transition-all duration-300">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link
            href="/dashboard"
            className="hidden sm:block px-5 py-2 bg-white/5 border border-white/10 text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-md hover:bg-white/10 hover:border-accent-red/30 hover:shadow-[0_0_15px_rgba(230,57,70,0.1)] transition-all mr-2"
          >
            Dashboard
          </Link>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border-2 border-accent-red/50 hover:border-accent-red transition-colors",
                userButtonPopoverCard: "bg-bg-secondary border border-border-primary shadow-2xl backdrop-blur-xl",
                userPreviewMainIdentifier: "text-white font-bold",
                userPreviewSecondaryIdentifier: "text-gray-400"
              }
            }}
          />
        </SignedIn>
      </div>
    </nav>
  )
}
