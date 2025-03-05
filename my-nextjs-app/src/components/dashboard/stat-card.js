'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'

export default function StatCard({ title, value, icon, change, changeType }) {
  const Icon = icon;
  const changeColor = changeType === 'increase' ? 'text-green-600' : 'text-red-600';
  const changeIcon = changeType === 'increase' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-stone-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-stone-50">
          <Icon className="h-6 w-6 text-stone-600" />
        </div>
      </div>
      {change && (
        <div className={`mt-3 flex items-center text-xs font-medium ${changeColor}`}>
          {changeIcon}
          <span className="ml-1">{change} from last period</span>
        </div>
      )}
    </div>
  );
}