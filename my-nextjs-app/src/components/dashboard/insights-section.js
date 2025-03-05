'use client'

import InsightCard from './insight-card'

export default function InsightsSection({ insights }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-stone-100 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-stone-800">AI-Powered Insights</h3>
        <span className="text-xs bg-stone-100 px-2 py-1 rounded-full text-stone-600">Updated hourly</span>
      </div>
      <div className="space-y-3">
        {insights.slice(0, 2).map((insight, index) => (
          <InsightCard key={index} insight={insight} />
        ))}
      </div>
    </div>
  );
}