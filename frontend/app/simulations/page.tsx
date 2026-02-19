export default function SimulationsPage() {
  const scenarios = [
    {
      id: 1,
      title: 'Reroute Through Busan',
      cost: '$1.2M',
      risk: '45% reduction',
      time: '72h resolution',
      recommended: false,
    },
    {
      id: 2,
      title: 'Activate Backup Suppliers',
      cost: '$890K',
      risk: '72% reduction',
      time: '48h resolution',
      recommended: true,
    },
    {
      id: 3,
      title: 'Hybrid: Reroute + Backups',
      cost: '$1.5M',
      risk: '85% reduction',
      time: '36h resolution',
      recommended: false,
    },
  ]

  return (
    <div className="min-h-screen bg-[#090c13] pt-14">
      <div className="max-w-[1080px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">
            Scenario Simulations
          </h2>
          <p className="text-sm text-[#9ca3af]">
            AI-generated mitigation strategies for Port Strike — Shanghai
          </p>
        </div>

        {/* 3-Column Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`bg-[#111827] rounded-xl p-6 relative ${
                scenario.recommended
                  ? 'border border-[#dc2626]'
                  : 'border border-transparent'
              }`}
            >
              {/* Recommended Badge */}
              {scenario.recommended && (
                <span className="absolute top-4 right-4 px-2 py-0.5 bg-[#dc2626] text-white text-[11px] font-semibold rounded">
                  Recommended
                </span>
              )}

              <h3 className="text-white font-bold text-lg mb-6 pr-24">
                {scenario.title}
              </h3>

              {/* Metrics */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6b7280]">Est. Cost</span>
                  <span className="text-sm font-bold text-white">
                    {scenario.cost}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6b7280]">Risk Reduction</span>
                  <span className="text-sm font-bold text-white">
                    {scenario.risk}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6b7280]">Time</span>
                  <span className="text-sm font-bold text-white">
                    {scenario.time}
                  </span>
                </div>
              </div>

              {/* Button */}
              <button className="w-full py-2.5 bg-transparent text-white text-sm font-medium rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                Open Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
