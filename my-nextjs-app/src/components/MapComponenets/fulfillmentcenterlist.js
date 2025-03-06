import React, { useState, useEffect } from 'react';
import { Truck, Package, TrendingUp, Clock, BarChart2, MapPin, ChevronRight } from 'lucide-react';
import ReturnCategoryLegend from './legend';

export default function FulfillmentCentersList({ centers = [], getStats, activeCenter, onCenterClick, categories }) {
  const [animateIn, setAnimateIn] = useState(false);
  const isLoading = !centers || centers.length === 0;
  
  // Trigger animations after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Get appropriate status for center
  const getCenterStatus = (center) => {
    const stats = getStats(center);
    if (stats.totalReturns > 5) return { label: 'High Volume', color: 'amber' };
    if (center.metrics.averageProcessingTime > 3) return { label: 'Slow Processing', color: 'red' };
    return { label: 'Optimal', color: 'emerald' };
  };
  
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-slate-200">
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold flex items-center text-lg">
            <div className="bg-white bg-opacity-20 p-1.5 text-gray-800 rounded-lg mr-2">
              <Truck className="h-5 w-5" />
            </div>
            Fulfillment Centers
          </h2>
          <div className="text-xs bg-white text-gray-800 bg-opacity-20 px-2 py-1 rounded-full">
            {centers.length} centers
          </div>
        </div>
      </div>
      
      {/* Centers list */}
      <div className="overflow-y-auto flex-1 p-2 space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <div className="text-slate-500 font-medium">Loading centers...</div>
          </div>
        ) : (
          centers.map((center, index) => {
            const stats = getStats(center);
            const isActive = activeCenter?.id === center.id;
            const status = getCenterStatus(center);
            const animationDelay = `${index * 50}ms`;
            
            return (
              <div 
                key={center.id}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 transform
                  ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 shadow-md' 
                    : 'bg-white hover:bg-gray-50 border border-gray-200 hover:shadow-md'
                  }`}
                onClick={() => onCenterClick(center)}
                style={{ transitionDelay: animationDelay }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      status.color === 'emerald' ? 'bg-emerald-100' : 
                      status.color === 'amber' ? 'bg-amber-100' : 
                      status.color === 'red' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <Package className={`h-5 w-5 ${
                        status.color === 'emerald' ? 'text-emerald-600' : 
                        status.color === 'amber' ? 'text-amber-600' : 
                        status.color === 'red' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{center.name}</h3>
                      <p className="text-xs text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {center.location.city}, {center.location.state}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
                      status.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' : 
                      status.color === 'amber' ? 'bg-amber-100 text-amber-800' : 
                      status.color === 'red' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full mr-1 ${
                        status.color === 'emerald' ? 'bg-emerald-500' : 
                        status.color === 'amber' ? 'bg-amber-500' : 
                        status.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></span>
                      {status.label}
                    </span>
                    <span className="text-xs font-medium text-gray-600 mt-1">
                      {stats.totalReturns} returns
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-md border border-slate-200">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-medium text-slate-600 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Processing Time
                      </p>
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        center.metrics.averageProcessingTime <= 2 ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}></div>
                    </div>
                    <p className="font-bold text-slate-800 text-sm mt-1">{center.metrics.averageProcessingTime} days</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-md border border-slate-200">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-medium text-slate-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Resale Rate
                      </p>
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        center.metrics.returnResaleRate >= 75 ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}></div>
                    </div>
                    <p className="font-bold text-slate-800 text-sm mt-1">{center.metrics.returnResaleRate}%</p>
                  </div>
                </div>
                
                {stats.shipping && (
                  <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-blue-50 p-1 rounded-md mr-2">
                        <BarChart2 className="h-3 w-3 text-blue-500" />
                      </div>
                      <span className="text-xs text-gray-600">Avg. Distance:</span>
                      <span className="text-xs font-semibold text-gray-800 ml-1">
                        {stats.shipping.avgDistance} miles
                      </span>
                    </div>
                    
                    <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                      isActive ? 'transform rotate-90' : ''
                    }`} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* Return categories legend */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <p className="text-xs font-medium text-gray-500 mb-2">Return Categories</p>
        <ReturnCategoryLegend categories={categories || {}} />
      </div>
    </div>
  );
}