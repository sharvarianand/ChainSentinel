export default function CompliancePage() {
  const constraints = [
    'OFAC Sanctions Check',
    'Dual-Source Policy',
    'Carbon Cap Compliance',
    'GDPR Data Residency',
    'Cost Threshold ($500K)',
    'Supplier Diversity',
  ]

  const overrideLog = [
    {
      action: 'Emergency reroute via Port B',
      rule: 'Cost Threshold',
      result: 'Override',
      approvedBy: 'John Smith',
      time: '2h ago',
    },
    {
      action: 'Activate backup supplier C',
      rule: 'Dual-Source Policy',
      result: 'Pass',
      approvedBy: null,
      time: '4h ago',
    },
    {
      action: 'Transfer supplier data to US',
      rule: 'GDPR Data Residency',
      result: 'Blocked',
      approvedBy: null,
      time: '6h ago',
    },
  ]

  // Donut chart segments (red, yellow, blue, green)
  const segments = [
    { color: '#dc2626', percent: 30, label: 'Trade' },
    { color: '#f59e0b', percent: 25, label: 'Policy' },
    { color: '#3b82f6', percent: 20, label: 'Environmental' },
    { color: '#22c55e', percent: 25, label: 'Data Privacy' },
  ]

  // SVG donut chart calculation
  const radius = 70
  const circumference = 2 * Math.PI * radius
  let cumulativeOffset = 0

  return (
    <div className="min-h-screen bg-[#090c13] pt-14">
      <div className="max-w-[1080px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Compliance Report</h2>
          <p className="text-sm text-[#9ca3af]">
            Autonomous actions validated against regulatory and policy constraints
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Donut Chart */}
          <div className="bg-[#111827] rounded-xl p-8 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mb-6">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full -rotate-90"
              >
                {segments.map((seg) => {
                  const dashLength = (seg.percent / 100) * circumference
                  const dashGap = circumference - dashLength
                  const offset = cumulativeOffset
                  cumulativeOffset += dashLength
                  return (
                    <circle
                      key={seg.label}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="16"
                      strokeDasharray={`${dashLength} ${dashGap}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                    />
                  )
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">94%</span>
                <span className="text-xs text-[#6b7280]">Adherence</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center">
              {segments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: seg.color }}
                  />
                  <span className="text-xs text-[#9ca3af]">{seg.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Constraints & Override Log */}
          <div className="space-y-6">
            {/* Active Constraints */}
            <div className="bg-[#111827] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Active Constraints
              </h3>
              <div className="flex flex-wrap gap-2">
                {constraints.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1.5 bg-[#1a2235] text-white text-xs rounded-full"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Override Log */}
            <div className="bg-[#111827] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Override Log
              </h3>
              <div className="space-y-3">
                {overrideLog.map((entry, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#1a2235] rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{entry.action}</span>
                      <span
                        className={`text-[11px] font-semibold ${
                          entry.result === 'Pass'
                            ? 'text-[#22c55e]'
                            : entry.result === 'Blocked'
                            ? 'text-[#ef4444]'
                            : 'text-[#f59e0b]'
                        }`}
                      >
                        {entry.result}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#6b7280]">
                      <span>Rule: {entry.rule}</span>
                      <span>{entry.time}</span>
                    </div>
                    {entry.approvedBy && (
                      <div className="text-[11px] text-[#6b7280] mt-1">
                        Approved by: {entry.approvedBy}
                      </div>
                    )}
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
