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
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sm:px-12 transition-all duration-300">
      {/* Cinematic Gradient Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-red/50 to-transparent" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group relative z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-accent-red to-[#9B1B24] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(230,57,70,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(230,57,70,0.7)] transition-all duration-500">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <span className="text-white font-space-grotesk font-bold text-xl tracking-tighter uppercase whitespace-nowrap">
          Chain<span className="text-accent-red drop-shadow-[0_0_8px_rgba(230,57,70,0.8)]">Sentinel</span>
        </span>
      </Link>

      {/* Right Side: Nav Links & Action */}
      <div className="flex items-center gap-8 relative z-10">
        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = !isLandingPage && (
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href))
            )

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all duration-300 group ${isActive
                  ? 'text-accent-red font-bold drop-shadow-[0_0_4px_rgba(230,57,70,0.8)]'
                  : 'text-text-secondary hover:text-white'
                  }`}
              >
                <span className="relative z-10">{link.name}</span>
                {/* Hover Pill Background */}
                <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            )
          })}
        </div>

        {/* Vertical Divider */}
        {isLandingPage && <div className="hidden lg:block w-px h-8 bg-white/10" />}

        {/* Action Button */}
        {isLandingPage && (
          <>
            <SignedIn>
              <Link href="/dashboard">
                <button
                  className="relative hidden sm:flex items-center justify-center px-6 py-2.5 bg-accent-red text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-md overflow-hidden group shadow-[0_0_15px_rgba(230,57,70,0.4)] hover:shadow-[0_0_25px_rgba(230,57,70,0.6)] transition-all duration-300"
                >
                  {/* Animated Light Sweep Effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10 font-bold whitespace-nowrap">Launch Portal</span>
                </button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
                <button
                  className="relative hidden sm:flex items-center justify-center px-6 py-2.5 bg-accent-red text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-md overflow-hidden group shadow-[0_0_15px_rgba(230,57,70,0.4)] hover:shadow-[0_0_25px_rgba(230,57,70,0.6)] transition-all duration-300"
                >
                  {/* Animated Light Sweep Effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10 font-bold whitespace-nowrap">Launch Portal</span>
                </button>
              </SignInButton>
            </SignedOut>
          </>
        )}

        {/* User Profile (Only shown when logged in) */}
        <SignedIn>
          <div className="flex items-center justify-center p-0.5 rounded-full bg-gradient-to-br from-border-primary to-bg-tertiary ml-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border border-border-primary ring-2 ring-transparent hover:ring-accent-red/50 transition-all",
                }
              }}
            />
          </div>
        </SignedIn>
      </div>
    </nav>
  )
}
