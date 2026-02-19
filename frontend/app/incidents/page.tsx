export default function IncidentsPage() {
  const incidents = [
    {
      id: 'INC-2024-001',
      title: 'Port Strike - Shanghai',
      costSaved: '$2.3M',
      predictionAccuracy: '94%',
      steps: ['Detected', 'Assessed', 'Simulating', 'Resolved'],
      currentStep: 3,
    },
    {
      id: 'INC-2024-002',
      title: 'Typhoon Warning - Taiwan Strait',
      costSaved: '$850K',
      predictionAccuracy: '88%',
      steps: ['Detected', 'Assessed', 'Simulating', 'Resolved'],
      currentStep: 2,
    },
    {
      id: 'INC-2024-003',
      title: 'Supplier Default - TechParts Vietnam',
      costSaved: '$450K',
      predictionAccuracy: '91%',
      steps: ['Detected', 'Assessed', 'Simulating', 'Resolved'],
      currentStep: 1,
    },
    {
      id: 'INC-2024-004',
      title: 'Flooding - Mumbai Region',
      costSaved: '$180K',
      predictionAccuracy: '96%',
      steps: ['Detected', 'Assessed', 'Simulating', 'Resolved'],
      currentStep: 3,
    },
  ]

  const stepColors: Record<string, string> = {
    Detected: 'border-[#7c3aed] text-[#7c3aed]',
    Assessed: 'border-[#d97706] text-[#d97706]',
    Simulating: 'border-[#dc2626] text-[#dc2626]',
    Resolved: 'border-[#22c55e] text-[#22c55e]',
  }

  return (
    <div className="min-h-screen bg-[#090c13] pt-14">
      <div className="max-w-[1080px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Incident Log</h2>
          <p className="text-sm text-[#9ca3af]">
            Complete history of disruptions and autonomous resolutions
          </p>
        </div>

        {/* Incident Rows */}
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-[#111827] rounded-xl p-6 flex items-center gap-6"
            >
              {/* Left: Info */}
              <div className="flex-shrink-0 w-52">
                <div className="text-sm font-bold text-white mb-1">
                  {incident.id}
                </div>
                <div className="text-xs text-white mb-2">{incident.title}</div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#22c55e] font-semibold">
                    {incident.costSaved} saved
                  </span>
                  <span className="text-[#06b6d4] font-semibold">
                    {incident.predictionAccuracy} accuracy
                  </span>
                </div>
              </div>

              {/* Center: Step Pipeline */}
              <div className="flex-1 flex items-center justify-center gap-1">
                {incident.steps.map((step, i) => (
                  <div key={step} className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded text-[11px] font-semibold border ${
                        i <= incident.currentStep
                          ? stepColors[step]
                          : 'border-[#374151] text-[#374151]'
                      }`}
                    >
                      {step}
                    </span>
                    {i < incident.steps.length - 1 && (
                      <span className="text-[#374151] mx-1 text-xs">——</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Right: Action */}
              <button className="flex-shrink-0 px-4 py-2 bg-transparent text-white text-xs font-medium rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                View Audit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
