'use client'

import { motion } from 'framer-motion'
import { ShieldAlert, CheckCircle2, AlertTriangle, FileText, Scale, Fingerprint, Lock, ShieldCheck, Download } from 'lucide-react'

export default function CompliancePage() {
  const constraints = [
    { name: 'OFAC Sanctions Check', status: 'Active', severity: 'critical' },
    { name: 'Dual-Source Policy', status: 'Active', severity: 'high' },
    { name: 'Carbon Cap Compliance', status: 'Active', severity: 'medium' },
    { name: 'GDPR Data Residency', status: 'Active', severity: 'critical' },
    { name: 'Cost Threshold ($500K)', status: 'Active', severity: 'medium' },
    { name: 'Supplier Diversity Goals', status: 'Active', severity: 'low' },
  ]

  const overrideLog = [
    {
      action: 'Emergency reroute via Port B',
      rule: 'Cost Threshold',
      result: 'Override',
      approvedBy: 'John Smith (VP Ops)',
      time: '2h ago',
      agent: 'Orchestration Core',
      risk: 'Medium'
    },
    {
      action: 'Activate backup supplier C',
      rule: 'Dual-Source Policy',
      result: 'Pass',
      approvedBy: 'Auto-Approved',
      time: '4h ago',
      agent: 'Simulation Engine',
      risk: 'Low'
    },
    {
      action: 'Transfer supplier data to US server',
      rule: 'GDPR Data Residency',
      result: 'Blocked',
      approvedBy: 'System Firewall',
      time: '6h ago',
      agent: 'Intelligence AI',
      risk: 'Critical'
    },
    {
      action: 'Onboard Node: Nexus Tech Limited',
      rule: 'OFAC Sanctions Check',
      result: 'Blocked',
      approvedBy: 'Compliance API',
      time: '12h ago',
      agent: 'Risk Engine',
      risk: 'Critical'
    },
    {
      action: 'Expedited Air Freight Allocation',
      rule: 'Carbon Cap Compliance',
      result: 'Override',
      approvedBy: 'Sarah Connor (Dir Logistics)',
      time: '14h ago',
      agent: 'Orchestration Core',
      risk: 'High'
    },
  ]

  // Donut chart segments (red, yellow, blue, green)
  const segments = [
    { color: '#dc2626', percent: 30, label: 'Trade & Sanctions' },
    { color: '#f59e0b', percent: 25, label: 'Corporate Policy' },
    { color: '#3b82f6', percent: 20, label: 'Environmental ESG' },
    { color: '#22c55e', percent: 25, label: 'Data Privacy & Security' },
  ]

  const kpis = [
    { label: "Overall Compliance Score", value: "94.2%", change: "+0.8%", status: "good", icon: ShieldCheck },
    { label: "Policy Overrides (24h)", value: "12", change: "-3", status: "good", icon: Fingerprint },
    { label: "Blocked Actions (24h)", value: "8", change: "+2", status: "warning", icon: Lock },
    { label: "Active Constraints", value: "142", change: "0", status: "neutral", icon: Scale },
  ]

  // SVG donut chart calculation
  const radius = 90
  const circumference = 2 * Math.PI * radius
  let cumulativeOffset = 0

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 w-full">
      <div className="w-full max-w-[1920px] mx-auto px-6 xl:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-space-grotesk font-bold text-text-primary tracking-tight">Compliance & Governance</h1>
            <p className="text-sm text-text-secondary mt-1">Autonomous actions validated against immutable regulatory and corporate constraints</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-transparent border border-border-primary text-text-primary text-xs font-bold font-mono tracking-widest uppercase rounded-lg hover:bg-white/5 hover:border-white/20 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={kpi.label}
                className="bg-bg-secondary border border-border-primary rounded-xl p-5 relative overflow-hidden group hover:border-accent-red/30 transition-colors cursor-default"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-bg-tertiary rounded-lg border border-border-primary">
                    <Icon className="w-5 h-5 text-accent-red" />
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded-full ${kpi.status === 'warning' ? 'text-warning bg-warning/10' :
                      kpi.status === 'good' ? 'text-success bg-success/10' :
                        'text-text-secondary bg-bg-tertiary'
                    }`}>
                    {kpi.change}
                  </span>
                </div>
                <h3 className="text-text-secondary text-sm font-medium">{kpi.label}</h3>
                <div className="text-3xl font-space-grotesk font-bold text-text-primary mt-1">{kpi.value}</div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Donut Chart & Constraints */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Donut Chart */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden h-[400px]">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-accent-red/5 blur-[50px] rounded-full scale-150 pointer-events-none" />

              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider self-start mb-6 w-full border-b border-border-primary pb-4">Constraint Distribution</h3>

              <div className="relative w-48 h-48 mb-6 mt-4 drop-shadow-[0_0_15px_rgba(230,57,70,0.1)]">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  {segments.map((seg, i) => {
                    const dashLength = (seg.percent / 100) * circumference
                    const dashGap = circumference - dashLength
                    const offset = cumulativeOffset
                    cumulativeOffset += dashLength
                    return (
                      <motion.circle
                        initial={{ strokeDasharray: `0 ${circumference}` }}
                        animate={{ strokeDasharray: `${dashLength} ${dashGap}` }}
                        transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                        key={seg.label}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="16"
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        className="hover:stroke-[20px] transition-all duration-300 cursor-pointer"
                      />
                    )
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-space-grotesk font-bold text-white tracking-tighter">94<span className="text-2xl text-accent-red">%</span></span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted mt-1">Adherence</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3 w-full mt-auto">
                {segments.map((seg) => (
                  <div key={seg.label} className="flex items-center justify-between w-full text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: seg.color }} />
                      <span className="text-text-secondary">{seg.label}</span>
                    </div>
                    <span className="text-white font-bold">{seg.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Constraints */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent-red" />
                Active Rule Engines
              </h3>
              <div className="flex flex-col gap-3">
                {constraints.map((c) => (
                  <div key={c.name} className="flex justify-between items-center bg-bg-tertiary border border-border-primary px-4 py-3 rounded-lg group hover:border-white/20 transition-all">
                    <span className="text-white text-sm font-medium group-hover:text-accent-red transition-colors">{c.name}</span>
                    <div className="flex items-center gap-3">
                      {c.severity === 'critical' && <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />}
                      {c.severity === 'high' && <span className="w-2 h-2 rounded-full bg-warning" />}
                      {c.severity === 'medium' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                      {c.severity === 'low' && <span className="w-2 h-2 rounded-full bg-success" />}
                      <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Override Log Matrix */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-border-primary flex justify-between items-center bg-bg-secondary sticky top-0 z-10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-red" />
                Global Audit Matrix
              </h3>
              <span className="text-xs font-mono text-text-muted bg-bg-tertiary px-3 py-1 rounded border border-border-primary">Live Feed</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                {overrideLog.map((entry, i) => {
                  const isBlocked = entry.result === 'Blocked'
                  const isOverride = entry.result === 'Override'
                  const isPass = entry.result === 'Pass'

                  return (
                    <motion.div
                      variants={itemVariants}
                      key={i}
                      className={`p-5 bg-bg-tertiary rounded-xl border relative overflow-hidden group transition-all duration-300 ${isBlocked ? 'border-accent-red/40 hover:border-accent-red/80 shadow-[0_0_15px_rgba(230,57,70,0.05)]' :
                          isOverride ? 'border-warning/40 hover:border-warning/80' :
                            'border-border-primary hover:border-white/20'
                        }`}
                    >
                      {/* Background Gradient */}
                      {isBlocked && <div className="absolute inset-0 bg-accent-red/5 pointer-events-none" />}
                      {isOverride && <div className="absolute inset-0 bg-warning/5 pointer-events-none" />}

                      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded border flex items-center gap-1.5 ${isBlocked ? 'bg-accent-red/10 border-accent-red/30 text-accent-red' :
                                isOverride ? 'bg-warning/10 border-warning/30 text-warning' :
                                  'bg-success/10 border-success/30 text-success'
                              }`}>
                              {isBlocked ? <Lock className="w-3 h-3" /> : isOverride ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                              {entry.result}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono">{entry.time}</span>
                          </div>

                          <h4 className="text-base font-bold text-white mb-1 group-hover:text-accent-red transition-colors">{entry.action}</h4>
                          <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
                            <Scale className="w-3 h-3" /> Constraint Triggered: <span className="text-white">{entry.rule}</span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-2 border-t xl:border-t-0 border-border-primary pt-4 xl:pt-0">
                          <div className="text-left xl:text-right">
                            <span className="text-[10px] text-text-muted uppercase font-mono tracking-widest block mb-0.5">Authorizing Agent/Entity</span>
                            <span className="text-xs font-bold text-white block truncate max-w-[200px]">{entry.approvedBy}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-text-muted uppercase font-mono tracking-widest block mb-0.5">Trigger Entity</span>
                            <span className="text-xs font-bold text-accent-red block">{entry.agent}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
