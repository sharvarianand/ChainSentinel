'use client'

import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { Radar, MoveRight, ShieldCheck, Zap, Globe as GlobeIcon, Activity, Facebook, Twitter, Linkedin, Github } from 'lucide-react'
import dynamic from 'next/dynamic'
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { TextHoverEffect } from "@/components/ui/hover-footer"

// Dynamically import CobeGlobe to avoid SSR issues
const CobeGlobe = dynamic(() => import('@/components/visualizations/CobeGlobe').then(m => m.CobeGlobe), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-bg-secondary animate-pulse rounded-full" />
})


const features = [
  {
    title: "Detect",
    description: "Intelligence Agents scan global signals 24/7 — news, weather, port data — to catch disruptions before they impact your nodes.",
    link: "#detect",
    icon: Radar
  },
  {
    title: "Decide",
    description: "AI simulates thousands of scenarios, calculates cascading risks, and identifies the optimal response in milliseconds.",
    link: "#decide",
    icon: Activity
  },
  {
    title: "Resolve",
    description: "Autonomous agents execute mitigation — negotiate with suppliers, reroute logistics, and restore flow without intervention.",
    link: "#resolve",
    icon: ShieldCheck
  }
];

export default function HomePage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section id="vision" className="relative min-h-screen flex items-center pt-20 px-6 sm:px-12 lg:px-24">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-hero opacity-50 z-0" />

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-start"
          >
            {/* Badge pill */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-red/20 bg-accent-red/5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse shadow-[0_0_10px_#E63946]" />
              <span className="text-xs font-mono uppercase tracking-widest text-text-secondary">Next-Generation Supply Chain Intelligence</span>
            </motion.div>

            {/* Giant H1 */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-space-grotesk font-bold text-text-primary tracking-tighter leading-tight mb-6 uppercase"
            >
              Autonomous <br />
              <span className="text-accent-red">Supply Chain</span> <br />
              Control
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-text-secondary max-w-lg mb-10 leading-relaxed"
            >
              Detect threats. Decide strategies. Resolve automatically.
              The future of resilience is autonomous.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4"
            >
              <SignedIn>
                <Link href="/dashboard">
                  <button className="group px-8 py-4 bg-accent-red text-white font-bold rounded-lg hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] transition-all duration-300 flex items-center gap-2">
                    Launch Dashboard
                    <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
                  <button className="group px-8 py-4 bg-accent-red text-white font-bold rounded-lg hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] transition-all duration-300 flex items-center gap-2">
                    Launch Dashboard
                    <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
              </SignedOut>
              <button
                onClick={() => alert("Demo Mode activated!")}
                className="px-8 py-4 bg-transparent text-white font-bold rounded-lg border border-border-primary hover:bg-white/5 transition-all duration-300"
              >
                Demo Mode
              </button>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div
              variants={itemVariants}
              className="mt-16 grid grid-cols-3 gap-8 border-l border-border-primary pl-8"
            >
              <div>
                <div className="text-2xl font-bold font-mono text-text-primary">$12.4M</div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted">Mitigated</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-text-primary">47ms</div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted">Response</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-text-primary">99.2%</div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted">Accuracy</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            className="hidden lg:block relative h-[800px] w-full"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[120%] h-[120%] bg-accent-red/5 rounded-full blur-[120px]" />
            </div>
            <CobeGlobe />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-12 rounded-full bg-gradient-to-b from-accent-red to-transparent opacity-50"
          />
        </div>
      </section>

      {/* Feature Phase Section */}
      <section id="features" className="bg-bg-secondary py-24 px-6 border-y border-border-primary">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-space-grotesk font-bold uppercase tracking-tight mb-4">
              We Embody Resilience
            </h2>
            <div className="w-20 h-1 bg-accent-red" />
          </div>

          <HoverEffect items={features} />

          <div className="mt-16 flex justify-center">
            <SignedIn>
              <Link href="/dashboard">
                <button className="group relative px-10 py-4 bg-bg-primary border border-accent-red/50 text-white font-bold rounded-lg hover:bg-accent-red/10 hover:border-accent-red transition-all duration-300 flex items-center gap-3 overflow-hidden shadow-[0_0_15px_rgba(230,57,70,0.1)] hover:shadow-[0_0_30px_rgba(230,57,70,0.3)]">
                  <span className="relative z-10 uppercase tracking-widest font-mono text-sm">Let's Get Started</span>
                  <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10 text-accent-red" />
                  {/* Optional subtle light sweep effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                </button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
                <button className="group relative px-10 py-4 bg-bg-primary border border-accent-red/50 text-white font-bold rounded-lg hover:bg-accent-red/10 hover:border-accent-red transition-all duration-300 flex items-center gap-3 overflow-hidden shadow-[0_0_15px_rgba(230,57,70,0.1)] hover:shadow-[0_0_30px_rgba(230,57,70,0.3)]">
                  <span className="relative z-10 uppercase tracking-widest font-mono text-sm">Let's Get Started</span>
                  <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10 text-accent-red" />
                  {/* Optional subtle light sweep effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Social / Trust Section */}
      <section id="network" className="py-20 px-6 overflow-hidden">
        <div className="container mx-auto text-center">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-text-muted mb-12">
            Trusted by the world's most resilient networks
          </p>

          <div className="relative flex overflow-hidden group w-full py-8 select-none">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

            <div className="flex shrink-0 animate-marquee items-center justify-around gap-12 md:gap-24 min-w-full pr-12 md:pr-24">
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">AURORA LOGISTICS</span>
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">GLOBAL PORT INC.</span>
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">STRATA SUPPLY</span>
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">NODE CORE</span>
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">VORTEX SYSTEMS</span>
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">NEXUS FREIGHT</span>
            </div>

            <div className="flex shrink-0 animate-marquee items-center justify-around gap-12 md:gap-24 min-w-full pr-12 md:pr-24" aria-hidden="true">
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">AURORA LOGISTICS</span>
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">GLOBAL PORT INC.</span>
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">STRATA SUPPLY</span>
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">NODE CORE</span>
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">VORTEX SYSTEMS</span>
              <span className="text-2xl font-bold font-space-grotesk opacity-30 group-hover:opacity-100 transition-opacity duration-700">NEXUS FREIGHT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Enhancements */}
      <footer className="bg-bg-secondary border-t border-border-primary pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Branding */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-8 group">
                <div className="w-10 h-10 bg-accent-red rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(230,57,70,0.5)] group-hover:scale-110 transition-transform">
                  <ShieldCheck className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-space-grotesk font-bold uppercase tracking-tighter">
                  Chain<span className="text-accent-red">Sentinel</span>
                </span>
              </Link>
              <p className="text-text-secondary leading-relaxed mb-6">
                Redefining supply chain resilience through autonomous AI agents and real-time intelligence.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="p-2 border border-border-primary rounded-lg text-text-muted hover:text-accent-red hover:border-accent-red/30 transition-all"><Twitter size={20} /></Link>
                <Link href="#" className="p-2 border border-border-primary rounded-lg text-text-muted hover:text-accent-red hover:border-accent-red/30 transition-all"><Github size={20} /></Link>
                <Link href="#" className="p-2 border border-border-primary rounded-lg text-text-muted hover:text-accent-red hover:border-accent-red/30 transition-all"><Linkedin size={20} /></Link>
              </div>
            </div>

            {/* Links Group 1 */}
            <div>
              <h4 className="text-lg font-bold font-space-grotesk uppercase mb-8">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">Operations Control</Link></li>
                <li><Link href="/simulations" className="text-text-muted hover:text-text-primary transition-colors">Scenario Theater</Link></li>
                <li><Link href="/suppliers" className="text-text-muted hover:text-text-primary transition-colors">Supplier Network</Link></li>
                <li><Link href="/incidents" className="text-text-muted hover:text-text-primary transition-colors">Forensic Log</Link></li>
              </ul>
            </div>

            {/* Links Group 2 */}
            <div>
              <h4 className="text-lg font-bold font-space-grotesk uppercase mb-8">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-text-muted hover:text-text-primary transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-text-muted hover:text-text-primary transition-colors">API Reference</Link></li>
                <li><Link href="#" className="text-text-muted hover:text-text-primary transition-colors">Case Studies</Link></li>
                <li><Link href="#" className="text-text-muted hover:text-text-primary transition-colors">Agent Methodology</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-bold font-space-grotesk uppercase mb-8">Stay Alert</h4>
              <p className="text-text-muted text-sm mb-6">Receive insights on global supply chain trends and platform updates.</p>
              <form className="relative">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full bg-bg-primary border border-border-primary rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:border-accent-red/50 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 p-1.5 bg-accent-red rounded-md text-white hover:bg-accent-red-dark transition-colors"
                >
                  <MoveRight size={20} />
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-border-primary pt-12 text-[10px] font-mono uppercase tracking-widest text-text-muted">
            <p>© 2026 ChainSentinel Systems. All rights reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <Link href="#" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-text-primary transition-colors">Security Audit</Link>
            </div>
          </div>
        </div>

        {/* Text Hover Effect Background */}
        <div className="w-full h-40 md:h-60 mt-12 opacity-50 relative z-0 pointer-events-auto">
          <TextHoverEffect text="CHAINSENTINEL" />
        </div>
      </footer>
    </div>
  )
}
