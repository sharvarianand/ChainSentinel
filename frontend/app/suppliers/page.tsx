'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, ShieldAlert, CheckCircle2, AlertTriangle, TrendingDown, Box, Activity, Server } from 'lucide-react'

// Enhanced mock data
const mockSuppliers = [
  { id: '1', name: 'ShenZhen Electronics Co.', tier: 1, region: 'China - Guangdong', trustScore: 72, activePOs: 14, leadTime: '12 Days', status: 'Warning', riskFactor: 'Port Congestion' },
  { id: '2', name: 'Shanghai Port Logistics', tier: 1, region: 'China - Shanghai', trustScore: 55, activePOs: 8, leadTime: '18 Days', status: 'At Risk', riskFactor: 'Weather Delay' },
  { id: '3', name: 'TechParts Taiwan', tier: 1, region: 'Taiwan', trustScore: 85, activePOs: 22, leadTime: '5 Days', status: 'Healthy', riskFactor: 'None' },
  { id: '4', name: 'Mumbai Textiles Ltd.', tier: 2, region: 'India - Maharashtra', trustScore: 48, activePOs: 4, leadTime: '21 Days', status: 'Critical', riskFactor: 'Labor Strike' },
  { id: '5', name: 'Vietnam Assembly Corp.', tier: 2, region: 'Vietnam', trustScore: 70, activePOs: 11, leadTime: '14 Days', status: 'Warning', riskFactor: 'Customs Delay' },
  { id: '6', name: 'Korea Semi Inc.', tier: 1, region: 'South Korea', trustScore: 88, activePOs: 31, leadTime: '3 Days', status: 'Healthy', riskFactor: 'None' },
  { id: '7', name: 'German Precision GmbH', tier: 1, region: 'Germany', trustScore: 92, activePOs: 18, leadTime: '7 Days', status: 'Healthy', riskFactor: 'None' },
  { id: '8', name: 'Brazil Materials SA', tier: 2, region: 'Brazil', trustScore: 51, activePOs: 6, leadTime: '24 Days', status: 'At Risk', riskFactor: 'Route Disruption' },
  { id: '9', name: 'Japan Quality Corp.', tier: 1, region: 'Japan', trustScore: 91, activePOs: 42, leadTime: '4 Days', status: 'Healthy', riskFactor: 'None' },
  { id: '10', name: 'Mexi-Tech Assembly', tier: 2, region: 'Mexico - Monterrey', trustScore: 83, activePOs: 15, leadTime: '6 Days', status: 'Healthy', riskFactor: 'None' },
]

const kpis = [
  { label: "Active Nodes", value: "8,432", change: "+142", status: "neutral", icon: Server },
  { label: "High Risk Nodes", value: "124", change: "+12", status: "warning", icon: AlertTriangle },
  { label: "Network Reliability", value: "94.2%", change: "-0.8%", status: "warning", icon: Activity },
  { label: "Nodes Down", value: "3", change: "0", status: "good", icon: ShieldAlert },
]

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')

  const filtered = mockSuppliers.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.riskFactor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTier = selectedTier === 'All' || s.tier === Number(selectedTier)
    const matchStatus = selectedStatus === 'All' || s.status === selectedStatus
    return matchSearch && matchTier && matchStatus
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
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
            <h1 className="text-3xl font-space-grotesk font-bold text-text-primary tracking-tight">Supplier Intelligence</h1>
            <p className="text-sm text-text-secondary mt-1">Real-time network node assessment and routing</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-accent-red text-white text-xs font-bold font-mono tracking-widest uppercase rounded-lg shadow-[0_0_15px_rgba(230,57,70,0.4)] hover:shadow-[0_0_25px_rgba(230,57,70,0.6)] transition-all">
              + Onboard Node
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
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded-full ${kpi.change.startsWith('+') && kpi.status === 'warning' ? 'text-warning bg-warning/10' :
                      kpi.change.startsWith('-') && kpi.status === 'warning' ? 'text-warning bg-warning/10' :
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

        {/* Search & Filter */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search nodes by name, region, or risk factor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-bg-tertiary text-text-primary text-sm placeholder:text-text-muted rounded-lg border border-border-primary outline-none focus:border-accent-red focus:ring-1 focus:ring-accent-red/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-bg-tertiary border border-border-primary rounded-lg px-3 py-1.5 flex-1 md:flex-none">
              <Filter className="w-4 h-4 text-text-muted" />
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="bg-transparent text-text-primary text-sm border-none outline-none cursor-pointer w-full"
              >
                <option value="All">All Tiers</option>
                <option value="1">Tier 1</option>
                <option value="2">Tier 2</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-bg-tertiary border border-border-primary rounded-lg px-3 py-1.5 flex-1 md:flex-none">
              <Activity className="w-4 h-4 text-text-muted" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-text-primary text-sm border-none outline-none cursor-pointer w-full"
              >
                <option value="All">All Statuses</option>
                <option value="Healthy">Healthy</option>
                <option value="Warning">Warning</option>
                <option value="At Risk">At Risk</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3-Column Card Grid with Framer Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filtered.map((supplier) => {
            const isCritical = supplier.status === 'Critical' || supplier.status === 'At Risk'
            const colorClass = isCritical ? 'text-accent-red' : supplier.status === 'Warning' ? 'text-warning' : 'text-success'

            return (
              <motion.div
                variants={itemVariants}
                key={supplier.id}
                className={`bg-bg-secondary rounded-xl p-6 relative overflow-hidden group border ${isCritical ? 'border-accent-red/50 shadow-[0_0_15px_rgba(230,57,70,0.1)]' : 'border-border-primary hover:border-white/20 hover:shadow-xl'} transition-all flex flex-col`}
              >
                {/* Background Glow for Critical */}
                {isCritical && (
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-red/10 rounded-full blur-[40px] pointer-events-none" />
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 bg-bg-tertiary border border-border-primary text-text-primary text-[10px] font-mono tracking-widest uppercase rounded`}>
                    Tier {supplier.tier}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold font-mono tracking-widest uppercase ${colorClass} bg-bg-tertiary border ${isCritical ? 'border-accent-red/30' : supplier.status === 'Warning' ? 'border-warning/30' : 'border-success/30'}`}>
                    {isCritical ? <AlertTriangle className="w-3 h-3" /> : supplier.status === 'Warning' ? <ShieldAlert className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {supplier.status}
                  </div>
                </div>

                {/* Supplier Name */}
                <h4 className="text-text-primary font-bold text-lg mb-1 leading-tight group-hover:text-white transition-colors">
                  {supplier.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-text-muted mb-6">
                  <MapPin className="w-3 h-3" />
                  {supplier.region}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-bg-tertiary border border-border-primary p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted uppercase mb-1 font-mono">
                      <Box className="w-3 h-3" /> Active POs
                    </div>
                    <div className="text-white font-bold text-lg">{supplier.activePOs}</div>
                  </div>
                  <div className="bg-bg-tertiary border border-border-primary p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted uppercase mb-1 font-mono">
                      <Activity className="w-3 h-3" /> Lead Time
                    </div>
                    <div className="text-white font-bold text-lg">{supplier.leadTime}</div>
                  </div>
                </div>

                {/* Risk Factor */}
                {supplier.riskFactor !== 'None' && (
                  <div className="mb-6 flex items-start gap-2 text-xs text-accent-red bg-accent-red/5 border border-accent-red/20 p-2.5 rounded">
                    <TrendingDown className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong className="font-bold">Risk Identified:</strong> {supplier.riskFactor}</span>
                  </div>
                )}

                <div className="flex-grow" />

                {/* Trust Score */}
                <div className="mb-6 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">Reliability Score</span>
                    <span className={`text-sm font-bold font-mono ${supplier.trustScore > 80 ? 'text-success' : supplier.trustScore > 50 ? 'text-warning' : 'text-accent-red'}`}>
                      {supplier.trustScore}/100
                    </span>
                  </div>
                  <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${supplier.trustScore > 80 ? 'bg-success' : supplier.trustScore > 50 ? 'bg-warning' : 'bg-accent-red'}`}
                      style={{ width: `${supplier.trustScore}%` }}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  {isCritical ? (
                    <button className="flex-1 py-2.5 bg-accent-red text-white text-[10px] uppercase font-bold tracking-wider font-mono rounded-lg hover:bg-accent-red-dark hover:shadow-[0_0_15px_rgba(230,57,70,0.5)] transition-all">
                      Orchestrate Backup
                    </button>
                  ) : (
                    <button className="flex-1 py-2.5 bg-transparent border border-border-primary text-text-secondary text-[10px] uppercase font-bold tracking-wider font-mono rounded-lg hover:border-white/30 hover:text-white transition-all">
                      View Analytics
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-bg-secondary border border-border-primary rounded-full mb-4">
              <Search className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No nodes found</h3>
            <p className="text-text-secondary">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  )
}
