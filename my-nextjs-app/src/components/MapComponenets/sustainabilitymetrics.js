import React, { useState, useEffect } from 'react';
import { Leaf, Cloud, Route, TrendingDown, ChevronDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Sample data for mini-charts
const sampleTrendData = [
  { month: 'Jan', value: 310 },
  { month: 'Feb', value: 290 },
  { month: 'Mar', value: 320 },
  { month: 'Apr', value: 270 },
  { month: 'May', value: 250 },
  { month: 'Jun', value: 260 },
];

export default function SustainabilityMetrics({ stats }) {
  const [isAnimated, setIsAnimated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsAnimated(true);
  }, []);

  // Animation classes
  const animClass = `transition-all duration-700 ${isAnimated ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`;
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-indigo-800 flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-indigo-600" />
            <span>Sustainability Impact</span>
            <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full font-medium">
              -12.4% YOY
            </span>
          </h2>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ChevronDown className={`h-5 w-5 transition-transform ${expanded ? 'transform rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      
      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Miles */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100 rounded-bl-full opacity-70" />
            
            <div className="flex items-start">
              <div className="bg-indigo-100 rounded-lg p-2 mr-3">
                <Route className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Shipping Miles</p>
                <p className={`text-xl font-bold text-gray-800 ${animClass}`}>
                  {stats.totalMiles.toLocaleString()}
                </p>
                <div className="flex items-center">
                  <p className="text-xs text-gray-500">{stats.avgMiles.toFixed(1)} mi per return</p>
                </div>
              </div>
            </div>
            
            <div className="h-8 mt-2 opacity-70">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleTrendData}>
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Carbon Emissions */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full opacity-70" />
            
            <div className="flex items-start">
              <div className="bg-amber-100 rounded-lg p-2 mr-3">
                <Cloud className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Carbon Footprint</p>
                <p className={`text-xl font-bold text-gray-800 ${animClass}`}>
                  {stats.carbonEmissions.toLocaleString()} kg
                </p>
                <div className="flex items-center">
                  <p className="text-xs text-gray-500">CO₂ equivalent</p>
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full text-center leading-none">!</span>
                </div>
              </div>
            </div>
            
            <div className="h-8 mt-2 opacity-70">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleTrendData}>
                  <Line type="monotone" dataKey="value" stroke="#d97706" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Potential Savings */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100 rounded-bl-full opacity-70" />
            
            <div className="flex items-start">
              <div className="bg-emerald-100 rounded-lg p-2 mr-3">
                <TrendingDown className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Potential Savings</p>
                <p className={`text-xl font-bold text-gray-800 ${animClass}`}>
                  {stats.potentialSavings.toLocaleString()} kg
                </p>
                <p className="text-xs text-gray-500">With route optimization</p>
              </div>
            </div>
            
            <div className="h-8 mt-2 opacity-70">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleTrendData}>
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Environmental Impact */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full opacity-70" />
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                <Leaf className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Equivalent Impact</p>
                <p className={`text-xl font-bold text-gray-800 ${animClass}`}>
                  {Math.round(stats.carbonEmissions / 21)} trees
                </p>
                <p className="text-xs text-gray-500">Annual sequestration</p>
              </div>
            </div>
            
            <div className="h-8 mt-2 opacity-70">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleTrendData}>
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expandable Details Section */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out border-t border-gray-200 ${expanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sustainability Progress</h3>
          
          <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${isAnimated ? (stats.potentialSavings / (stats.carbonEmissions + stats.potentialSavings) * 100) : 0}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-800">
                {Math.round((stats.potentialSavings / (stats.carbonEmissions + stats.potentialSavings)) * 100)}% potential realized
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
              <div className="flex items-center mb-1">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <p className="text-xs text-gray-600">Water</p>
              </div>
              <p className="text-sm font-medium text-gray-800">1.2M gal</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
              <div className="flex items-center mb-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                <p className="text-xs text-gray-600">Energy</p>
              </div>
              <p className="text-sm font-medium text-gray-800">+32%</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
              <div className="flex items-center mb-1">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                <p className="text-xs text-gray-600">Efficiency</p>
              </div>
              <p className="text-sm font-medium text-gray-800">+18%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}