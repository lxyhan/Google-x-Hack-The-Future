import React from 'react';
import { PieChart } from 'lucide-react';

export default function ReturnCategoryLegend({ categories = {} }) {
  // Ensure categories exists and has expected properties
  const safeCategories = {
    total: 0,
    'Resale': 0,
    'Refurbishment': 0,
    'Recycle': 0,
    'Damaged/Write-off': 0,
    ...categories
  };
  
  const categoryColors = {
    'Resale': { bg: 'bg-emerald-500', text: 'text-emerald-700' },
    'Refurbishment': { bg: 'bg-blue-500', text: 'text-blue-700' },
    'Recycle': { bg: 'bg-amber-500', text: 'text-amber-700' },
    'Damaged/Write-off': { bg: 'bg-red-500', text: 'text-red-700' }
  };
  
  return (
    <div className="p-4 pt-2 border-t border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 flex items-center mb-3">
        <PieChart className="h-4 w-4 mr-1.5 text-indigo-600" />
        Return Categories
      </h3>
      
      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
        {Object.entries(safeCategories)
          .filter(([key]) => key !== 'total')
          .map(([category, count]) => {
            const percentage = safeCategories.total > 0 
              ? Math.round((count / safeCategories.total) * 100) 
              : 0;
            
            return (
              <div key={category} className="flex items-center">
                <span 
                  className={`h-3 w-3 rounded-full mr-2 ${categoryColors[category]?.bg || 'bg-gray-500'}`}
                ></span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-gray-900 truncate">{category}</span>
                    <span className="text-gray-700 ml-1">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={`h-1.5 rounded-full ${categoryColors[category]?.bg || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}