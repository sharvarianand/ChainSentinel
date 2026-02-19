'use client'

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

const agentActivity = [
  'Intelligence Agent detected port congestion in Shanghai',
  'Risk Agent completed risk assessment for 12 suppliers',
  'Simulation Agent generated 4 mitigation scenarios',
  'Optimization Agent recommended backup supplier activation',
  'Orchestration Agent executed PO for backup supplier',
  'Learning Agent updated model accuracy metrics',
]

const disruptions = [
  { title: 'Port Strike - Shanghai', status: 'Simulating', badgeColor: 'bg-[#dc2626]' },
  { title: 'Typhoon Warning - Taiwan', status: 'Assessed', badgeColor: 'bg-[#d97706]' },
  { title: 'Supplier Default - Vietnam', status: 'Detected', badgeColor: 'bg-[#7c3aed]' },
  { title: 'Flooding - Mumbai Region', status: 'Recommended', badgeColor: 'bg-[#dc2626]' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#090c13] pt-14">
      <div className="max-w-[1080px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Command Center</h2>
            <p className="text-sm text-[#9ca3af]">
              Real-time autonomous supply chain monitoring
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Risk Heatmap (2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-[#111827] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">
                  Global Risk Heatmap
                </h3>
                <span className="text-xs text-[#6b7280]">Live</span>
              </div>
              <div className="space-y-4">
                {riskData.map((item) => (
                  <div key={item.city} className="flex items-center gap-4">
                    <span className="w-32 text-sm text-[#9ca3af] truncate">
                      {item.city}
                    </span>
                    <div className="flex-1 h-2 bg-[#374151] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ef4444] rounded-full transition-all duration-700"
                        style={{ width: `${item.risk}%` }}
                      />
                    </div>
                    <span className="w-10 text-sm text-white text-right font-mono">
                      {item.risk}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            {/* Agent Activity Feed */}
            <div className="bg-[#111827] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Agent Activity Feed
              </h3>
              <div className="space-y-3">
                {agentActivity.map((item, i) => (
                  <div key={i} className="flex gap-2 text-sm text-[#9ca3af]">
                    <span className="text-white mt-0.5">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Disruptions */}
            <div className="bg-[#111827] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  Active Disruptions
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse" />
                  Updating every 30s
                </div>
              </div>
              <div className="space-y-3">
                {disruptions.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-white">{d.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold text-white ${d.badgeColor}`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#111827] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Run Simulation',
                  'View Reports',
                  'Add Supplier',
                  'System Health',
                ].map((action) => (
                  <button
                    key={action}
                    className="bg-[#1a2235] text-white text-sm rounded-lg py-3 hover:bg-[#243049] transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
