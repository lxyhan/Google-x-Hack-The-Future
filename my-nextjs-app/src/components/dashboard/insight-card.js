'use client'

import { TrendingUp, AlertTriangle, Package, ShoppingBag } from 'lucide-react'

export default function InsightCard({ insight }) {
  const priorities = {
    'High': 'bg-red-50 border-red-200 text-red-700',
    'Medium': 'bg-yellow-50 border-yellow-200 text-yellow-700',
    'Low': 'bg-blue-50 border-blue-200 text-blue-700'
  };
  
  const types = {
    'trend': <TrendingUp className="h-5 w-5 text-blue-500" />,
    'fraud': <AlertTriangle className="h-5 w-5 text-red-500" />,
    'inventory': <Package className="h-5 w-5 text-purple-500" />,
    'customer': <ShoppingBag className="h-5 w-5 text-green-500" />
  };
  
  const priorityClass = priorities[insight.priority] || priorities['Medium'];
  
  return (
    <div className={`p-4 border rounded-lg ${priorityClass} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {types[insight.type]}
          <h3 className="font-medium">{insight.title}</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
          {insight.priority} Priority
        </span>
      </div>
      <p className="mt-2 text-sm">{insight.description}</p>
      <div className="mt-3 text-xs">
        <p className="font-medium">Potential Impact: {insight.potentialImpact}</p>
      </div>
    </div>
  );
}