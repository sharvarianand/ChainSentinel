'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrainCircuit, Play, FastForward, Activity, ShieldCheck, AlertTriangle, Zap, Server, ChevronRight, Fingerprint, MapPin, Database } from 'lucide-react'

const initialScenarios = [
  {
    id: 1,
    title: 'Reroute Through Busan',
    cost: '$1.2M',
    riskReduction: '45%',
    time: '72h resolution',
    recommended: false,
    confidence: 68,
    metrics: { efficiency: 'Moderate', impact: 'Medium' }
  },
  {
    id: 2,
    title: 'Activate Backup Suppliers',
    cost: '$890K',
    riskReduction: '72%',
    time: '48h resolution',
    recommended: true,
    confidence: 94,
    metrics: { efficiency: 'High', impact: 'Low' }
  },
  {
    id: 3,
    title: 'Hybrid: Reroute + Backups',
    cost: '$1.5M',
    riskReduction: '85%',
    time: '36h resolution',
    recommended: false,
    confidence: 81,
    metrics: { efficiency: 'Very High', impact: 'High' }
  },
]

const defaultKpis = [
  { label: "Active Nodes Simulated", value: "2,041", change: "+12", status: "neutral", icon: Server },
  { label: "Total Value at Risk", value: "$42.1M", change: "+$2M", status: "warning", icon: AlertTriangle },
  { label: "Predictive Accuracy", value: "98.4%", change: "+0.2%", status: "good", icon: Activity },
  { label: "Models Running", value: "8", change: "0", status: "neutral", icon: BrainCircuit },
]

export default function SimulationsPage() {
  const [scenarioInput, setScenarioInput] = useState('')
  const [isSimulating, setIsSimulating] = useState(false)
  const [hasSimulated, setHasSimulated] = useState(false)
  const [scenarios, setScenarios] = useState(initialScenarios)
  const [kpis, setKpis] = useState(defaultKpis)

  const handleSimulate = () => {
    if (!scenarioInput.trim()) return

    setIsSimulating(true)
    setHasSimulated(false)

    // Mock API simulation delay
    setTimeout(() => {
      setIsSimulating(false)
      setHasSimulated(true)

      // Update data to reflect custom simulation
      setScenarios([
        {
          id: 4,
          title: 'Automated Contingency Alpha',
          cost: '$450K',
          riskReduction: '88%',
          time: '24h resolution',
          recommended: true,
          confidence: 96,
          metrics: { efficiency: 'Optimal', impact: 'Minimal' }
        },
        {
          id: 5,
          title: 'Strategic Supply Buffer',
          cost: '$1.8M',
          riskReduction: '95%',
          time: '12h resolution',
          recommended: false,
          confidence: 89,
          metrics: { efficiency: 'Expedited', impact: 'High Cost' }
        }
      ])

      setKpis([
        { label: "Active Nodes Simulated", value: "5,112", change: "+3k", status: "neutral", icon: Server },
        { label: "Total Value at Risk", value: "$18.4M", change: "-$23.7M", status: "good", icon: AlertTriangle },
        { label: "Predictive Accuracy", value: "99.1%", change: "+0.7%", status: "good", icon: Activity },
        { label: "Models Running", value: "24", change: "+16", status: "warning", icon: BrainCircuit },
      ])
    }, 3000)
  }

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
            <h1 className="text-3xl font-space-grotesk font-bold text-text-primary tracking-tight">AI Simulations</h1>
            <p className="text-sm text-text-secondary mt-1">Predictive modeling & generative mitigation strategies</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1 bg-bg-tertiary border border-border-primary rounded text-xs font-mono text-text-muted">
              <Database className="w-3 h-3 text-accent-red" />
              Dataset: Q1 Global
            </span>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 mb-8 shadow-lg relative overflow-hidden group">
          {/* Subtle Glow Background */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent-red/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-accent-red/10 transition-colors duration-700" />

          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-accent-red" />
            Define Scenario
          </h2>
          <p className="text-xs text-text-secondary mb-4">
            Describe a potential disruption (e.g. "What if the Suez Canal is blocked for 2 weeks?" or "Hurricane in Florida affecting semiconductor transit") and the AI will generate mitigation strategies.
          </p>

          <div className="flex gap-4 flex-col md:flex-row">
            <input
              type="text"
              placeholder="Enter a theoretical disruption or risk scenario..."
              value={scenarioInput}
              onChange={(e) => setScenarioInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
              className="flex-1 px-5 py-3.5 bg-bg-tertiary text-white text-sm placeholder:text-text-muted rounded-lg border border-border-primary outline-none focus:border-accent-red focus:ring-1 focus:ring-accent-red/50 transition-all shadow-inner"
              disabled={isSimulating}
            />
            <button
              onClick={handleSimulate}
              disabled={isSimulating || !scenarioInput.trim()}
              className="px-8 py-3.5 bg-accent-red text-white text-xs font-bold font-mono tracking-widest uppercase rounded-lg shadow-[0_0_15px_rgba(230,57,70,0.4)] hover:shadow-[0_0_30px_rgba(230,57,70,0.6)] hover:bg-accent-red-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 md:w-auto w-full"
            >
              {isSimulating ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Engine
                </>
              )}
            </button>
          </div>
        </div>

        {/* Simulation Processing State */}
        <AnimatePresence>
          {isSimulating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-bg-tertiary border border-accent-red/30 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(230,57,70,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_3s_linear_infinite]" />

                <BrainCircuit className="w-12 h-12 text-accent-red animate-pulse mb-6" />
                <h3 className="text-xl font-space-grotesk font-bold text-white mb-2">Generative AI analyzing scenario vectors...</h3>

                <div className="flex flex-col items-center gap-2 font-mono text-xs text-accent-red/80 mt-4 h-16">
                  <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>&gt; Injecting variables into global supply chain twin</motion.div>
                  <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}>&gt; Projecting cascading supplier failures</motion.div>
                  <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 1.0 }}>&gt; Calculating financial risk vs mitigation costs</motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live KPIs */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={false}
          animate={{ opacity: isSimulating ? 0.5 : 1 }}
        >
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={kpi.label + kpi.value} // Force re-render animation when value changes
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-bg-secondary border border-border-primary rounded-xl p-5 relative overflow-hidden group hover:border-accent-red/30 transition-colors"
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
        </motion.div>

        {/* Results / Strategies Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-accent-red" />
            {hasSimulated ? "Generated Mitigation Scenarios" : "Baseline Disruption Scenarios"}
          </h3>
          <span className="text-xs text-text-muted font-mono uppercase tracking-widest">{scenarios.length} Models Ready</span>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isSimulating ? "hidden" : "show"}
        >
          {scenarios.map((scenario) => (
            <motion.div
              variants={itemVariants}
              key={scenario.id}
              className={`bg-bg-secondary rounded-xl p-6 relative flex flex-col group overflow-hidden ${scenario.recommended
                ? 'border border-accent-red/50 shadow-[0_0_20px_rgba(230,57,70,0.15)]'
                : 'border border-border-primary hover:border-white/20 hover:shadow-xl'
                } transition-all duration-300`}
            >
              {/* Background gradient if recommended */}
              {scenario.recommended && (
                <div className="absolute inset-0 bg-gradient-to-b from-accent-red/5 to-transparent pointer-events-none" />
              )}

              {/* Recommended Badge */}
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex-1 pr-6">
                  <h3 className="text-white font-bold text-lg leading-tight group-hover:text-accent-red transition-colors">
                    {scenario.title}
                  </h3>
                </div>
                {scenario.recommended && (
                  <span className="shrink-0 px-2.5 py-1 bg-accent-red text-white text-[10px] font-bold font-mono uppercase tracking-widest rounded shadow-[0_0_10px_rgba(230,57,70,0.5)] flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" />
                    Recommended
                  </span>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                <div className="bg-bg-tertiary border border-border-primary p-3 rounded-lg">
                  <span className="text-[10px] text-text-muted uppercase font-mono block mb-1">Est. Cost</span>
                  <span className="text-sm font-bold text-white block">{scenario.cost}</span>
                </div>
                <div className="bg-bg-tertiary border border-border-primary p-3 rounded-lg">
                  <span className="text-[10px] text-text-muted uppercase font-mono block mb-1">Risk Reduction</span>
                  <span className="text-sm font-bold text-success block">{scenario.riskReduction}</span>
                </div>
                <div className="bg-bg-tertiary border border-border-primary p-3 rounded-lg">
                  <span className="text-[10px] text-text-muted uppercase font-mono block mb-1">Resolution Time</span>
                  <span className="text-sm font-bold text-white block">{scenario.time}</span>
                </div>
                <div className="bg-bg-tertiary border border-border-primary p-3 rounded-lg">
                  <span className="text-[10px] text-text-muted uppercase font-mono block mb-1">AI Confidence</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white block">{scenario.confidence}%</span>
                    <div className="flex-1 h-1 bg-black/50 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-red rounded-full" style={{ width: `${scenario.confidence}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-grow" />

              {/* Button */}
              <div className="relative z-10 mt-2 pt-4 border-t border-border-primary">
                <button className={`w-full py-3 text-[10px] font-bold tracking-widest uppercase font-mono rounded-lg transition-all flex items-center justify-center gap-2 ${scenario.recommended
                  ? 'bg-accent-red text-white hover:bg-accent-red-dark hover:shadow-[0_0_15px_rgba(230,57,70,0.4)]'
                  : 'bg-bg-tertiary text-text-secondary border border-border-primary hover:text-white hover:border-white/30'
                  }`}>
                  Deploy Strategy
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
