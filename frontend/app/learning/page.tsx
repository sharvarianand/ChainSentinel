export default function LearningPage() {
  const accuracyTrends = [
    { label: 'Disruption Detection', value: '91%', change: '+3.2%', direction: 'up' },
    { label: 'Risk Probability', value: '84%', change: '+2.1%', direction: 'up' },
    { label: 'Cost Estimation', value: '86%', change: '+1.8%', direction: 'up' },
    { label: 'Time Prediction', value: '79%', change: '-0.5%', direction: 'down' },
  ]

  const patterns = [
    'Suppliers in port-adjacent regions show 23% higher resilience during port disruptions',
    'Carrier reliability drops below 60% when handling volumes > 10K units',
    'Response time improves 35% when backup suppliers are pre-notified',
    'Southeast Asia disruptions correlate with monsoon season at 87% confidence',
  ]

  const trustMovements = [
    { supplier: 'ShenZhen Electronics', from: 70, to: 72, change: '+2' },
    { supplier: 'TechParts Taiwan', from: 82, to: 85, change: '+3' },
    { supplier: 'Shanghai Port Logistics', from: 68, to: 65, change: '-3' },
    { supplier: 'German Precision GmbH', from: 90, to: 92, change: '+2' },
    { supplier: 'Mumbai Textiles Ltd.', from: 60, to: 58, change: '-2' },
    { supplier: 'Korea Semi Inc.', from: 86, to: 88, change: '+2' },
  ]

  return (
    <div className="min-h-screen bg-[#090c13] pt-14">
      <div className="max-w-[1080px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Learning Insights</h2>
          <p className="text-sm text-[#9ca3af]">
            How the system improves over time through continuous learning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Accuracy Trends */}
          <div className="bg-[#111827] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">
              Accuracy Trends
            </h3>
            <div className="space-y-5">
              {accuracyTrends.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm text-[#9ca3af] mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {item.value}
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      item.direction === 'up'
                        ? 'text-[#22c55e]'
                        : 'text-[#ef4444]'
                    }`}
                  >
                    {item.direction === 'up' ? '\u2191' : '\u2193'}{' '}
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pattern Discovery + Trust Movements */}
          <div className="space-y-6">
            {/* Pattern Discovery */}
            <div className="bg-[#111827] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Pattern Discovery
              </h3>
              <div className="space-y-2.5">
                {patterns.map((pattern, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 bg-[#1a2235] rounded-lg text-sm text-[#9ca3af]"
                  >
                    {pattern}
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Movements */}
            <div className="bg-[#111827] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Trust Movements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {trustMovements.map((m) => (
                  <div
                    key={m.supplier}
                    className="bg-[#1a2235] rounded-lg p-3"
                  >
                    <div className="text-xs text-white font-medium mb-1 truncate">
                      {m.supplier}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[#6b7280]">{m.from}</span>
                      <span className="text-[#6b7280]">&rarr;</span>
                      <span className="text-white font-mono">{m.to}</span>
                      <span
                        className={`ml-auto font-semibold ${
                          m.change.startsWith('+')
                            ? 'text-[#22c55e]'
                            : 'text-[#ef4444]'
                        }`}
                      >
                        {m.change}
                      </span>
                    </div>
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
