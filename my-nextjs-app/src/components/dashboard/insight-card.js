'use client'

import { TrendingUp, AlertTriangle, Package, ShoppingBag, ArrowRight } from 'lucide-react'

export default function InsightCard({ insight }) {
  // Modern style configurations based on insight type (focusing on type rather than priority)
  const typeStyles = {
    'trend': {
      icon: <TrendingUp className="h-5 w-5 text-white" />,
      iconBg: 'bg-blue-500',
      gradientBg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      accentColor: 'bg-blue-500',
      textColor: 'text-blue-700',
      lightTextColor: 'text-blue-500'
    },
    'fraud': {
      icon: <AlertTriangle className="h-5 w-5 text-white" />,
      iconBg: 'bg-red-500',
      gradientBg: 'bg-gradient-to-br from-red-50 to-red-100',
      accentColor: 'bg-red-500',
      textColor: 'text-red-700',
      lightTextColor: 'text-red-500'

    },
    'inventory': {
      icon: <Package className="h-5 w-5 text-white" />,
      iconBg: 'bg-purple-500',
      gradientBg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      accentColor: 'bg-purple-500',
      textColor: 'text-purple-700',
      lightTextColor: 'text-purple-500'
    },
    'customer': {
      icon: <ShoppingBag className="h-5 w-5 text-white" />,
      iconBg: 'bg-green-500',
      gradientBg: 'bg-gradient-to-br from-green-50 to-green-100',
      accentColor: 'bg-green-500',
      textColor: 'text-green-700',
      lightTextColor: 'text-green-500'
    }
  };
  
  // Priority badge styling
  const priorityBadges = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-amber-100 text-amber-800',
    'Low': 'bg-blue-100 text-blue-800'
  };
  
  const style = typeStyles[insight.type] || typeStyles['trend'];
  const priorityBadge = priorityBadges[insight.priority] || priorityBadges['Medium'];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start">
        {/* Left icon column */}
        <div className={`${style.iconBg} p-4 flex items-center justify-center`}>
          {style.icon}
        </div>
        
        {/* Content area */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-stone-800">{insight.title}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityBadge}`}>
              {insight.priority}
            </span>
          </div>
          
          <p className="mt-2 text-sm text-stone-600">{insight.description}</p>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs font-medium text-stone-500">Impact: <span className={`font-bold ${style.textColor}`}>{insight.potentialImpact}</span></span>
            <button className={`text-xs flex items-center ${style.lightTextColor} font-medium hover:underline`}>
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}