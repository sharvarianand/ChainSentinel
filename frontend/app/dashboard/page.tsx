'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, ShieldCheck, Zap, Server, LineChart as LineChartIcon, BrainCircuit, Globe } from 'lucide-react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import dynamic from 'next/dynamic'
import { io } from 'socket.io-client'

// Dynamically import Globe3D
const Globe3D = dynamic(() => import('@/components/visualizations/Globe3D'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-bg-tertiary animate-pulse rounded-full" />
})

const riskData = [
  { city: 'Shanghai, China', risk: 85 },
  { city: 'Shenzhen, China', risk: 72 },
  { city: 'Mumbai, India', risk: 58 },
  { city: 'Taiwan', risk: 45 },
  { city: 'Vietnam', risk: 35 },
  { city: 'South Korea', risk: 28 },
  { city: 'Japan', risk: 22 },
  { city: 'Germany', risk: 15 },
]

const initialActivity = [
  { agent: 'Intelligence', message: 'Detected port congestion in Shanghai', time: 'Just now' },
  { agent: 'Risk', message: 'Risk assessment for 12 suppliers completed', time: '2m ago' },
  { agent: 'Simulation', message: 'Generated 4 mitigation scenarios', time: '5m ago' },
  { agent: 'Optimization', message: 'Recommended backup supplier activation', time: '12m ago' },
  { agent: 'Orchestration', message: 'Executed PO for backup supplier', time: '14m ago' },
]

const initialDisruptions = [
  { title: 'Port Strike - Shanghai', status: 'Simulating', severity: 'critical' },
  { title: 'Typhoon Warning - Taiwan', status: 'Assessed', severity: 'warning' },
  { title: 'Supplier Default - Vietnam', status: 'Detected', severity: 'high' },
  { title: 'Flooding - Mumbai Region', status: 'Recommended', severity: 'critical' },
]

const kpis = [
  { label: "Value at Risk", value: "$4.2M", change: "-$1.1M", status: "good", icon: AlertTriangle },
  { label: "Active Mitigations", value: "3", change: "+1", status: "warning", icon: ShieldCheck },
  { label: "Avg Response Time", value: "47ms", change: "-4ms", status: "good", icon: Zap },
  { label: "Monitored Nodes", value: "8,432", change: "+142", status: "neutral", icon: Server },
]

const agents = [
  { name: "Intelligence", status: "active", latency: "12ms" },
  { name: "Risk", status: "active", latency: "45ms" },
  { name: "Simulation", status: "processing", latency: "142ms" },
  { name: "Optimization", status: "idle", latency: "--" },
  { name: "Orchestration", status: "active", latency: "28ms" },
]

const chartData = [
  { time: '00:00', originalRisk: 65, mitigatedRisk: 65 },
  { time: '04:00', originalRisk: 70, mitigatedRisk: 55 },
  { time: '08:00', originalRisk: 85, mitigatedRisk: 45 },
  { time: '12:00', originalRisk: 90, mitigatedRisk: 30 },
  { time: '16:00', originalRisk: 75, mitigatedRisk: 25 },
  { time: '20:00', originalRisk: 60, mitigatedRisk: 20 },
  { time: '24:00', originalRisk: 50, mitigatedRisk: 15 },
]

export default function DashboardPage() {
  const [activities, setActivities] = useState(initialActivity)
  const [threats, setThreats] = useState(initialDisruptions)

  useEffect(() => {
    // Connect to FastAPI WebSocket backend
    const socket = io('http://localhost:8000', {
      path: '/ws/socket.io',
      transports: ['websocket']
    })

    socket.on('connect', () => {
      console.log('Connected to ChainSentinel live feed')
    })

    // Listen for real-time agent activity
    socket.on('agent_activity', (data: any) => {
      setActivities(prev => {
        const newFeed = [{
          agent: data.agent || 'System',
          message: data.message || 'Action executed',
          time: 'Just now'
        }, ...prev]
        return newFeed.slice(0, 5) // Keep only latest 5
      })
    })

    // Listen for new global threats
    socket.on('new_threat', (data: any) => {
      setThreats(prev => {
        const newThreatList = [{
          title: data.title || 'Unknown Disruption',
          status: data.status || 'Detected',
          severity: data.severity || 'high'
        }, ...prev]
        return newThreatList.slice(0, 4) // Keep 4 on screen
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12">
      <div className="w-full max-w-[1920px] mx-auto px-6 xl:px-12">
        {/* Header & Agent Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-space-grotesk font-bold text-text-primary tracking-tight">Command Center</h1>
            <p className="text-sm text-text-secondary mt-1">Real-time autonomous supply chain monitoring</p>
          </div>

          {/* Agent Health Bar */}
          <div className="flex items-center gap-4 bg-bg-secondary border border-border-primary rounded-lg p-3">
            <div className="hidden sm:flex items-center gap-2 mr-2 border-r border-border-primary pr-4">
              <BrainCircuit className="w-5 h-5 text-accent-red" />
              <span className="text-xs font-mono uppercase text-text-secondary font-bold">Agents</span>
            </div>
            {agents.map((agent) => (
              <div key={agent.name} className="flex flex-col items-center group relative cursor-pointer">
                <div className={`w-3 h-3 rounded-full mb-1 ${agent.status === 'active' ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                  agent.status === 'processing' ? 'bg-warning animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                    'bg-text-muted'
                  }`} />
                <span className="text-[10px] font-mono text-text-muted hidden sm:block">{agent.name.substring(0, 3).toUpperCase()}</span>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-tertiary border border-border-primary px-3 py-2 rounded text-xs whitespace-nowrap z-10 pointer-events-none">
                  <div className="font-bold text-text-primary">{agent.name} Agent</div>
                  <div className="text-text-secondary mt-1 flex justify-between gap-4">
                    <span>Status: <span className="capitalize text-white">{agent.status}</span></span>
                    <span>Lat: {agent.latency}</span>
                  </div>
                </div>
              </div>
            ))}
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
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded-full ${kpi.status === 'good' ? 'text-success bg-success/10' :
                    kpi.status === 'warning' ? 'text-warning bg-warning/10' :
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

        {/* Horizontal Agent Activity Timeline */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-red" />
              Live Autonomous Timeline
            </h3>
            <span className="text-xs font-mono text-text-muted border border-border-primary px-2 py-1 rounded bg-bg-tertiary">Real-time Agent Decisions</span>
          </div>

          <div className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
            {/* Added massive vertical padding to prevent the event cards from being clipped by the overflow container */}
            <div className="py-24 min-w-max relative flex items-center gap-4 px-4 justify-start md:justify-center">

              {/* Main Axis Line */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-border-primary -translate-y-1/2 z-0" />

              {activities.map((item, i) => {
                const isTop = i % 2 === 0
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative w-48 shrink-0 flex flex-col items-center group"
                  >
                    {/* Event Card (Alternating Top/Bottom) */}
                    <div className={`absolute w-56 p-3 bg-bg-tertiary border border-border-primary rounded-lg shadow-xl opacity-80 group-hover:opacity-100 group-hover:border-accent-red/50 transition-all z-20 ${isTop ? 'bottom-8' : 'top-8'
                      }`}>
                      {/* Connecting tick mark */}
                      <div className={`absolute left-1/2 -translate-x-1/2 w-px h-6 bg-border-primary group-hover:bg-accent-red/50 transition-colors z-0 ${isTop ? 'top-full' : 'bottom-full'
                        }`} />

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-accent-red uppercase">{item.agent} Agent</span>
                        <span className="text-[9px] text-text-muted whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-snug">{item.message}</p>
                    </div>

                    {/* Timeline Node Center */}
                    <div className="w-5 h-5 rounded-full border-4 border-bg-secondary bg-text-muted relative z-10 group-first:bg-accent-red group-hover:scale-125 group-first:shadow-[0_0_15px_rgba(230,57,70,0.8)] group-hover:bg-accent-red transition-all duration-300" />

                    {/* Active Gradient Line trailing the newest event */}
                    {i === 0 && (
                      <div className="absolute top-1/2 right-1/2 w-[100vw] h-px bg-gradient-to-r from-transparent via-accent-red to-accent-red -translate-y-1/2 z-0 opacity-50 block md:hidden" />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Chart Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Impact Chart */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <LineChartIcon className="w-5 h-5 text-accent-red" />
                    Risk Mitigation Trajectory
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">Projected unmitigated risk vs. autonomous intervention</p>
                </div>
                <span className="text-xs font-mono bg-bg-tertiary px-3 py-1 rounded text-text-muted border border-border-primary hidden sm:block">LAST 24H</span>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOriginal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMitigated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="originalRisk" name="Unmitigated Risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorOriginal)" />
                    <Area type="monotone" dataKey="mitigatedRisk" name="Mitigated Risk" stroke="#10b981" fillOpacity={1} fill="url(#colorMitigated)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Interactive 3D Risk Globe */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent-red" />
                  Live Geospatial Supply Routes
                </h3>
                <span className="flex items-center gap-2 text-xs text-text-secondary font-mono border border-border-primary px-3 py-1 rounded bg-bg-tertiary">
                  <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse shadow-[0_0_8px_rgba(230,57,70,0.8)]" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-text-secondary mb-6">Interactive view of critical nodes and active transit lines</p>

              <div className="relative w-full h-[400px] bg-bg-primary rounded-lg overflow-hidden border border-white/5">
                {/* Visual Glow Core behind globe */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 bg-accent-red/10 rounded-full blur-[80px]" />
                </div>
                <Globe3D />

                {/* Overlay Interface */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-md p-3 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-accent-red" />
                    <span className="text-text-primary font-mono tracking-wider">CRITICAL NODE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-accent-red opacity-50" />
                    <span className="text-text-secondary font-mono tracking-wider">ACTIVE TRANSIT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Human-in-the-Loop Approval */}
            <div className="bg-gradient-to-br from-bg-secondary to-[#2B121A] border border-accent-red/30 rounded-xl p-6 shadow-[0_0_20px_rgba(230,57,70,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-accent-red" />
                  Pending Approval
                </h3>
                <span className="text-xs bg-accent-red text-white px-2 py-0.5 rounded font-bold animate-pulse">1</span>
              </div>

              <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4">
                <p className="text-sm text-white font-medium mb-2">Reroute Air Freight for "Shanghai Port Strike"</p>
                <div className="text-xs text-text-secondary mb-4 space-y-1">
                  <p>Supplier: <span className="text-text-primary">Global Port Inc.</span></p>
                  <p>Cost Impact: <span className="text-warning">+$12,400</span></p>
                  <p>Time Saved: <span className="text-success">14 Days</span></p>
                </div>
                <div className="flex flex-col xl:flex-row gap-2">
                  <button className="flex-1 bg-accent-red hover:bg-accent-red-dark text-white text-xs font-bold py-2 px-3 rounded transition-colors whitespace-nowrap">Approve</button>
                  <button className="flex-1 bg-transparent border border-border-primary hover:bg-white/5 text-white text-xs font-bold py-2 px-3 rounded transition-colors whitespace-nowrap">Reject</button>
                </div>
              </div>
            </div>

            {/* Active Threats */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Active Threats
                </h3>
              </div>
              <div className="space-y-3">
                {threats.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border-primary/50 last:border-0 last:pb-0">
                    <span className="text-sm text-text-secondary truncate pr-3">{d.title}</span>
                    <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${d.severity === 'critical' ? 'bg-accent-red/20 text-accent-red border border-accent-red/30' :
                      d.severity === 'high' ? 'bg-warning/20 text-warning border border-warning/30' :
                        'bg-success/20 text-success border border-success/30'
                      }`}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

