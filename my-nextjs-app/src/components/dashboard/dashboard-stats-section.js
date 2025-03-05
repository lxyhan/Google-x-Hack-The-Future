'use client'

import { Package, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import StatCard from './stat-card'

export default function DashboardStatsSection({ statistics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      <StatCard 
        title="Total Returns (Month)" 
        value={statistics?.overall.total || 0} 
        icon={Package}
        change="5.2% ↑"
        changeType="increase"
      />
      <StatCard 
        title="Approval Rate" 
        value={`${(statistics?.overall.approved / statistics?.overall.total * 100).toFixed(1)}%`} 
        icon={CheckCircle}
        change="1.3% ↑"
        changeType="increase"
      />
      <StatCard 
        title="Processing Time" 
        value={`${statistics?.overall.averageProcessingTime} days`} 
        icon={Clock}
        change="0.2 days ↓"
        changeType="decrease"
      />
      <StatCard 
        title="Fraud Risk Items" 
        value={`${statistics?.fraudMetrics.highRiskPercentage}%`} 
        icon={AlertTriangle}
        change="0.5% ↓"
        changeType="decrease"
      />
    </div>
  );
}