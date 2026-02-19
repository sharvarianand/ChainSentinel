'use client'

import { useState } from 'react'

const mockSuppliers = [
  { id: '1', name: 'ShenZhen Electronics Co.', tier: 1, region: 'China - Guangdong', trustScore: 72 },
  { id: '2', name: 'Shanghai Port Logistics', tier: 1, region: 'China - Shanghai', trustScore: 65 },
  { id: '3', name: 'TechParts Taiwan', tier: 1, region: 'Taiwan', trustScore: 85 },
  { id: '4', name: 'Mumbai Textiles Ltd.', tier: 2, region: 'India - Maharashtra', trustScore: 58 },
  { id: '5', name: 'Vietnam Assembly Corp.', tier: 2, region: 'Vietnam', trustScore: 70 },
  { id: '6', name: 'Korea Semi Inc.', tier: 1, region: 'South Korea', trustScore: 88 },
  { id: '7', name: 'German Precision GmbH', tier: 1, region: 'Germany', trustScore: 92 },
  { id: '8', name: 'Brazil Materials SA', tier: 2, region: 'Brazil', trustScore: 61 },
  { id: '9', name: 'Japan Quality Corp.', tier: 1, region: 'Japan', trustScore: 91 },
]

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState<string>('All')

  const filtered = mockSuppliers.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.region.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTier =
      selectedTier === 'All' || s.tier === Number(selectedTier)
    return matchSearch && matchTier
  })

  return (
    <div className="min-h-screen bg-[#090c13] pt-14">
      <div className="max-w-[1080px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Supplier Network</h2>
          <p className="text-sm text-[#9ca3af]">
            Manage suppliers with trust scores and backup orchestration
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-md px-5 py-2.5 bg-[#111827] text-white text-sm placeholder:text-[#6b7280] rounded-full border-none outline-none focus:ring-1 focus:ring-[#dc2626]/50"
          />
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-4 py-2.5 bg-[#111827] text-white text-sm rounded-lg border-none outline-none cursor-pointer"
          >
            <option value="All">All Tiers</option>
            <option value="1">Tier 1</option>
            <option value="2">Tier 2</option>
          </select>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-[#111827] rounded-xl p-5 relative"
            >
              {/* Tier Badge */}
              <span className="absolute top-4 right-4 px-2 py-0.5 bg-[#1a2235] text-white text-[11px] font-medium rounded">
                Tier {supplier.tier}
              </span>

              {/* Supplier Name */}
              <h4 className="text-white font-bold text-base mb-1 pr-16">
                {supplier.name}
              </h4>
              <p className="text-xs text-[#6b7280] mb-4">{supplier.region}</p>

              {/* Trust Score */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6b7280]">Trust</span>
                <span className="text-sm font-bold text-white">
                  {supplier.trustScore}
                </span>
              </div>
              <div className="h-2 bg-[#374151] rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-[#22c55e] rounded-full transition-all duration-500"
                  style={{ width: `${supplier.trustScore}%` }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-[#dc2626] text-white text-xs font-semibold rounded-lg hover:bg-[#b91c1c] transition-colors">
                  Activate Backup
                </button>
                <button className="flex-1 py-2 bg-transparent text-white text-xs font-semibold rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
