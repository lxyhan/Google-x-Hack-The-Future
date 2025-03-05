'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'

export default function StatCard({ title, value, icon, change, changeType }) {
  const Icon = icon;
  
  // Define styling based on change type
  const changeStyles = {
    'increase': {
      icon: <ArrowUp className="h-3 w-3" />,
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    'decrease': {
      icon: <ArrowDown className="h-3 w-3" />,
      textColor: changeType === 'decrease' && title.includes('Time') ? 'text-green-600' : 'text-red-600',
      bgColor: changeType === 'decrease' && title.includes('Time') ? 'bg-green-50' : 'bg-red-50',
      borderColor: changeType === 'decrease' && title.includes('Time') ? 'border-green-200' : 'border-red-200'
    }
  };
  
  const changeStyle = changeStyles[changeType] || changeStyles['increase'];
  
  // Determine icon background based on title context
  const getIconStyles = () => {
    if (title.includes('Fraud') || title.includes('Risk')) {
      return 'bg-gradient-to-br from-red-100 to-red-200 text-red-600';
    } else if (title.includes('Processing')) {
      return 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600';
    } else if (title.includes('Approval')) {
      return 'bg-gradient-to-br from-green-100 to-green-200 text-green-600';
    } else {
      return 'bg-gradient-to-br from-stone-100 to-stone-200 text-stone-600';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-stone-100 hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
      {/* Add subtle pattern to the card */}
      <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-stone-50 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 -mb-4 -ml-4 rounded-full bg-stone-50 opacity-50"></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${getIconStyles()}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex">
          <div className={`flex items-center px-2 py-1 rounded-full ${changeStyle.bgColor} ${changeStyle.textColor} text-xs font-medium border ${changeStyle.borderColor}`}>
            {changeStyle.icon}
            <span className="ml-1">{change}</span>
          </div>
          <span className="ml-2 text-xs text-stone-500 self-center">from last period</span>
        </div>
      )}
    </div>
  );
}