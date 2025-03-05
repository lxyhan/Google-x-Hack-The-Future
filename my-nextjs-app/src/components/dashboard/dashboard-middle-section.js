'use client'

import ReturnReasonChart from './return-reason-chart'
import InsightsSection from './insights-section'

export default function DashboardMiddleSection({ statistics, insights }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Return reasons chart */}
      <div className="lg:col-span-1">
        <ReturnReasonChart data={statistics?.byReason || []} />
      </div>
      
      {/* Insights section */}
      <div className="lg:col-span-2">
        <InsightsSection insights={insights} />
      </div>
    </div>
  );
}