'use client'

import { motion } from 'framer-motion'
import { BrainCircuit, Activity, LineChart, TrendingUp, TrendingDown, Server, Network, ShieldAlert, Cpu } from 'lucide-react'

export default function LearningPage() {
  const accuracyTrends = [
    { label: 'Disruption Detection Engine', value: '94.2%', change: '+3.2%', direction: 'up', historical: [70, 75, 82, 88, 91, 94.2] },
    { label: 'Risk Probability Scoring', value: '88.1%', change: '+2.1%', direction: 'up', historical: [60, 65, 75, 80, 84, 88.1] },
    { label: 'Cost Impact Estimation', value: '89.5%', change: '+1.8%', direction: 'up', historical: [80, 82, 84, 85, 86, 89.5] },
    { label: 'Resolution Time Prediction', value: '81.4%', change: '-0.5%', direction: 'down', historical: [75, 78, 80, 82, 79, 81.4] },
  ]

  const patterns = [
    { text: 'Suppliers in port-adjacent regions show 23% higher resilience during marine disruptions due to secondary routing dominance.', confidence: 94, type: 'Geospatial' },
    { text: 'Carrier reliability drops below 60% system-wide when handling un-forecasted volumes > 10K TEUs immediately post-crisis.', confidence: 88, type: 'Capacity' },
    { text: 'Autonomous resolution time improves 35% when Tier 2 backup suppliers are pre-notified of Tier 1 weather risks.', confidence: 97, type: 'Orchestration' },
    { text: 'Southeast Asia logistical bottlenecks highly correlate with monsoon season variance at 87% predictive confidence.', confidence: 87, type: 'Meteorological' },
  ]

  const trustMovements = [
    { supplier: 'ShenZhen Electronics Co.', from: 70, to: 72, change: '+2', tier: 1 },
    { supplier: 'TechParts Taiwan', from: 82, to: 85, change: '+3', tier: 1 },
    { supplier: 'Shanghai Port Logistics', from: 68, to: 65, change: '-3', tier: 1 },
    { supplier: 'German Precision GmbH', from: 90, to: 92, change: '+2', tier: 1 },
    { supplier: 'Mumbai Textiles Ltd.', from: 60, to: 53, change: '-7', tier: 2 },
    { supplier: 'Korea Semi Inc.', from: 86, to: 88, change: '+2', tier: 1 },
    { supplier: 'Brazil Materials SA', from: 61, to: 64, change: '+3', tier: 2 },
    { supplier: 'Vietnam Assembly Corp.', from: 70, to: 68, change: '-2', tier: 2 },
  ]

  const kpis = [
    { label: "Predictive Models Active", value: "84", change: "+12", status: "good", icon: BrainCircuit },
    { label: "Data Nodes Ingested", value: "2.4B", change: "+14M", status: "good", icon: Server },
    { label: "System Accuracy Avg", value: "88.3%", change: "+1.6%", status: "good", icon: Activity },
    { label: "Patterns Autodiscovered", value: "1,420", change: "+43", status: "neutral", icon: Network },
  ]

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
            <h1 className="text-3xl font-space-grotesk font-bold text-text-primary tracking-tight">Machine Learning Insights</h1>
            <p className="text-sm text-text-secondary mt-1">Continuous system optimization through pattern discovery and autonomous training</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-accent-red/10 border border-accent-red/30 text-accent-red text-xs font-bold font-mono tracking-widest uppercase rounded-lg flex items-center gap-2">
              <Cpu className="w-4 h-4 animate-pulse" /> Training Engine Active
            </div>
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: Accuracy Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-1 space-y-6"
          >
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-accent-red" />
                Model Accuracy Vectors
              </h3>
              <div className="space-y-6 flex-1">
                {accuracyTrends.map((item, index) => (
                  <div key={item.label} className="group relative">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs text-text-muted font-mono uppercase tracking-widest mb-1">{item.label}</div>
                        <div className="text-2xl font-bold text-white font-space-grotesk group-hover:text-accent-red transition-colors">{item.value}</div>
                      </div>
                      <div className={`flex flex-col items-end`}>
                        <span className={`text-sm font-bold flex items-center gap-1 ${item.direction === 'up' ? 'text-success' : 'text-warning'}`}>
                          {item.direction === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {item.change}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono uppercase">Past 30 Days</span>
                      </div>
                    </div>
                    {/* Simulated mini sparkline */}
                    <div className="h-2 w-full bg-bg-tertiary rounded-full overflow-hidden flex items-end opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className={`h-full rounded-full transition-all duration-1000 ${item.direction === 'up' ? 'bg-gradient-to-r from-success/20 to-success' : 'bg-gradient-to-r from-warning/20 to-warning'}`} style={{ width: item.value }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Pattern Discovery + Trust */}
          <div className="xl:col-span-2 space-y-6">
            {/* Pattern Discovery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-secondary border border-border-primary rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Network className="w-5 h-5 text-accent-red" />
                Latest Insights & Pattern Discovery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patterns.map((pattern, i) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                    key={i}
                    className="p-5 bg-bg-tertiary border border-border-primary rounded-xl hover:border-accent-red/50 hover:shadow-[0_0_15px_rgba(230,57,70,0.1)] transition-all group"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-2 py-1 bg-black/30 border border-border-primary rounded text-[10px] font-mono text-text-muted uppercase tracking-widest group-hover:bg-accent-red/10 group-hover:text-accent-red group-hover:border-accent-red/30 transition-colors">
                        {pattern.type}
                      </span>
                      <span className="text-xs font-bold text-success font-mono flex items-center gap-1">
                        {pattern.confidence}% Confidence
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed group-hover:text-white transition-colors">
                      {pattern.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Trust Score Movements Matrix */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-bg-secondary border border-border-primary rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-accent-red" />
                  Supplier Reliability Score Recalculations
                </h3>
                <span className="text-xs font-mono text-text-muted">Updated Hourly</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {trustMovements.map((m, i) => {
                  const isPositive = m.change.startsWith('+')
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={m.supplier}
                      className={`bg-bg-tertiary border border-border-primary rounded-xl p-4 relative overflow-hidden group hover:border-white/20 transition-all`}
                    >
                      {/* Suble background flash color on hover */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none ${isPositive ? 'bg-success' : 'bg-accent-red'}`} />

                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted border border-border-primary px-1.5 py-0.5 rounded">Tier {m.tier}</span>
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded flex items-center gap-1 ${isPositive ? 'bg-success/10 text-success' : 'bg-accent-red/10 text-accent-red'}`}>
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {m.change}
                        </span>
                      </div>

                      <div className="text-sm text-white font-bold mb-3 truncate group-hover:text-white" title={m.supplier}>
                        {m.supplier}
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono bg-black/20 p-2 rounded border border-border-primary">
                        <span className="text-text-muted flex items-center gap-1">Prev: {m.from}</span>
                        <div className="h-px w-4 bg-border-primary relative">
                          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 rotate-45 border-t border-r border-border-primary" />
                        </div>
                        <span className={`font-bold ${isPositive ? 'text-success' : 'text-accent-red'}`}>New: {m.to}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
