'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ShieldAlert, Activity, CheckCircle2, AlertTriangle, Clock, Server, FileText, ChevronRight, Hash } from 'lucide-react'

// Enhanced mock data
const initialIncidents = [
  {
    id: 'INC-2024-001',
    title: 'Port Strike - Shanghai',
    costSaved: '$2.3M',
    predictionAccuracy: '94%',
    steps: ['Detected', 'Assessed', 'Simulating', 'Resolved'],
    currentStep: 3,
    timestamp: '2024-11-20 14:32:00',
    agent: 'Orchestration',
    severity: 'critical'
  },
  {
    id: 'INC-2024-002',
    title: 'Typhoon Warning - Taiwan Strait',
    costSaved: '$850K',
    predictionAccuracy: '88%',
    steps: ['Detected', 'Assessed', 'Simulating', 'Resolved'],
    currentStep: 2,
    timestamp: '2024-11-21 09:15:22',
    agent: 'Simulation',
    severity: 'high'
  },
  {
    id: 'INC-2024-003',
    title: 'Supplier Default - TechParts Vietnam',
    costSaved: '$450K',
    predictionAccuracy: '91%',
    steps: ['Detected', 'Assessed', 'Simulating', 'Resolved'],
    currentStep: 1,
    timestamp: '2024-11-21 11:45:10',
    agent: 'Risk',
    severity: 'warning'
  },
  {
    id: 'INC-2024-004',
    title: 'Flooding - Mumbai Region',
    costSaved: '$180K',
    predictionAccuracy: '96%',
    steps: ['Detected', 'Assessed', 'Simulating', 'Resolved'],
    currentStep: 3,
    timestamp: '2024-11-19 08:20:00',
    agent: 'Orchestration',
    severity: 'high'
  },
  {
    id: 'INC-2024-005',
    title: 'Cyberattack - Global Port Logistics',
    costSaved: '$5.1M',
    predictionAccuracy: '99%',
    steps: ['Detected', 'Assessed', 'Simulating', 'Resolved'],
    currentStep: 0,
    timestamp: 'Just now',
    agent: 'Intelligence',
    severity: 'critical'
  }
]

const kpis = [
  { label: "Active Incidents", value: "3", change: "+1", status: "warning", icon: AlertTriangle },
  { label: "Total Value Saved", value: "$3.7M", change: "+$530k", status: "good", icon: Activity },
  { label: "Avg Resolution Time", value: "14m", change: "-2m", status: "good", icon: Clock },
  { label: "Autonomous Success", value: "97.4%", change: "+0.4%", status: "good", icon: ShieldAlert },
]

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')

  const filtered = initialIncidents.filter((inc) => {
    const matchSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase())

    let matchStatus = true;
    if (selectedStatus === 'Resolved') {
      matchStatus = inc.currentStep === 3;
    } else if (selectedStatus === 'Active') {
      matchStatus = inc.currentStep < 3;
    }

    return matchSearch && matchStatus
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 w-full">
      <div className="w-full max-w-[1920px] mx-auto px-6 xl:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-space-grotesk font-bold text-text-primary tracking-tight">Incident Control Log</h1>
            <p className="text-sm text-text-secondary mt-1">Immutable history of network disruptions and autonomous resolutions</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-transparent border border-border-primary text-text-primary text-xs font-bold font-mono tracking-widest uppercase rounded-lg hover:bg-white/5 hover:border-white/20 transition-all flex items-center gap-2">
              <FileText className="w-4 h-4" /> Export Ledger
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

        {/* Search & Filter */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search incident ID or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-bg-tertiary text-text-primary text-sm placeholder:text-text-muted rounded-lg border border-border-primary outline-none focus:border-accent-red focus:ring-1 focus:ring-accent-red/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-bg-tertiary border border-border-primary rounded-lg px-3 py-1.5 flex-1 md:flex-none">
              <Filter className="w-4 h-4 text-text-muted" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-text-primary text-sm border-none outline-none cursor-pointer w-full"
              >
                <option value="All">All Incidents</option>
                <option value="Active">Active / Simulating</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Log List View */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filtered.map((incident) => {
            const isResolved = incident.currentStep === 3;
            const isCritical = incident.severity === 'critical' && !isResolved;

            return (
              <motion.div
                variants={itemVariants}
                key={incident.id}
                className={`bg-bg-secondary rounded-xl p-5 lg:p-6 flex flex-col xl:flex-row items-start xl:items-center gap-6 relative overflow-hidden group border ${isCritical ? 'border-accent-red/50 shadow-[0_0_15px_rgba(230,57,70,0.15)]' :
                    isResolved ? 'border-border-primary hover:border-white/20' :
                      'border-warning/30 hover:border-warning/50 shadow-[0_0_15px_rgba(234,179,8,0.05)]'
                  } transition-all duration-300`}
              >
                {/* Background pulse for active critical */}
                {isCritical && (
                  <div className="absolute inset-0 bg-accent-red/5 animate-pulse pointer-events-none" />
                )}

                {/* Left: Info */}
                <div className="flex-shrink-0 w-full xl:w-72 xl:pr-6 xl:border-r border-border-primary">
                  <div className="flex items-center justify-between xl:justify-start gap-3 mb-2">
                    <div className={`text-xs font-bold font-mono px-2 py-0.5 rounded flex items-center gap-1 ${isResolved ? 'bg-bg-tertiary text-text-muted border border-border-primary' :
                        isCritical ? 'bg-accent-red/10 text-accent-red border border-accent-red/30' :
                          'bg-warning/10 text-warning border border-warning/30'
                      }`}>
                      <Hash className="w-3 h-3" />
                      {incident.id}
                    </div>
                    {/* Mobile Only timestamp layout helper */}
                    <span className="text-[10px] text-text-muted font-mono xl:hidden block">
                      {incident.timestamp}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-3 leading-tight group-hover:text-accent-red transition-colors">
                    {incident.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-success flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {incident.costSaved} saved
                    </span>
                    <span className="text-text-primary flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      {incident.predictionAccuracy} accuracy
                    </span>
                  </div>
                  {/* Desktop Only timestamp layout helper */}
                  <div className="hidden xl:block text-[10px] text-text-muted font-mono mt-4">
                    Logged: {incident.timestamp}
                  </div>
                </div>

                {/* Center: Step Pipeline */}
                <div className="flex-1 w-full overflow-x-auto scrollbar-hide py-2 xl:py-0">
                  <div className="flex items-center justify-start min-w-max">
                    {incident.steps.map((step, i) => {
                      const isCompleted = i < incident.currentStep;
                      const isActive = i === incident.currentStep;
                      const isPending = i > incident.currentStep;

                      return (
                        <div key={step} className="flex items-center relative z-10">
                          {/* Step Node */}
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[11px] font-bold font-mono uppercase tracking-wider transition-all duration-500 ${isCompleted ? 'bg-success/10 border-success/30 text-success' :
                              isActive ? 'bg-accent-red border-accent-red text-white shadow-[0_0_15px_rgba(230,57,70,0.4)] scale-105' :
                                'bg-bg-tertiary border-border-primary text-text-muted'
                            }`}>
                            {isCompleted ? <CheckCircle2 className="w-3 h-3" /> :
                              isActive ? (step === 'Simulating' ? <Activity className="w-3 h-3 animate-spin duration-[3000ms]" /> : <Activity className="w-3 h-3 animate-pulse" />) :
                                <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />}
                            {step}
                          </div>

                          {/* Connector Line */}
                          {i < incident.steps.length - 1 && (
                            <div className="w-8 xl:w-12 h-px relative mx-1">
                              {/* Background track */}
                              <div className="absolute inset-0 bg-border-primary" />
                              {/* Active progress */}
                              <div className={`absolute inset-0 bg-success transition-all duration-1000 origin-left ${isCompleted ? 'scale-x-100' : 'scale-x-0'
                                }`} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Right: Agent & Action */}
                <div className="flex-shrink-0 w-full xl:w-48 flex xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-4 border-t xl:border-t-0 border-border-primary pt-4 xl:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-text-muted uppercase font-mono tracking-widest block mb-1 text-left xl:text-right">Autonomous Agent</span>
                    <span className="text-xs font-bold text-accent-red block text-left xl:text-right">{incident.agent}</span>
                  </div>
                  <button className="flex-shrink-0 px-4 py-2 bg-transparent text-white text-[10px] font-bold font-mono tracking-widest uppercase rounded-lg border border-border-primary hover:bg-white/5 hover:border-white/30 transition-all flex items-center gap-2">
                    View Audit <ChevronRight className="w-3 h-3" />
                  </button>
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
            <h3 className="text-xl font-bold text-text-primary mb-2">No incidents found</h3>
            <p className="text-text-secondary">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  )
}
