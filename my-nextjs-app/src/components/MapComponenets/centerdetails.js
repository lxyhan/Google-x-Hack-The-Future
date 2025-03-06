import React from 'react';
import { X, Package, Truck, ArrowUpDown, Calendar, Tag } from 'lucide-react';

export default function CenterDetailsPanel({ center, returns, onClose }) {
  // Group returns by status
  const returnsByStatus = {
    'Processed': returns.filter(item => item.status === 'Processed'),
    'In Process': returns.filter(item => item.status === 'In Process'),
    'Under Review': returns.filter(item => item.status === 'Under Review')
  };
  
  // Calculate total value
  const totalValue = returns.reduce((sum, item) => {
    return sum + item.items.reduce((itemSum, i) => itemSum + (i.price * (i.quantity || 1)), 0);
  }, 0);
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-indigo-50">
        <h2 className="text-xl font-bold text-indigo-900">{center.name}</h2>
        <button 
          onClick={onClose}
          className="rounded-full p-1 hover:bg-indigo-100 transition-colors"
        >
          <X className="h-5 w-5 text-indigo-700" />
        </button>
      </div>
      
      {/* Center stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b">
        <div className="bg-gray-50 rounded-md p-3">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-full p-2 mr-3">
              <Package className="h-4 w-4 text-indigo-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Returns</p>
              <p className="text-lg font-bold">{returns.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-md p-3">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <Tag className="h-4 w-4 text-green-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Value</p>
              <p className="text-lg font-bold">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-md p-3">
          <div className="flex items-center">
            <div className="bg-amber-100 rounded-full p-2 mr-3">
              <Truck className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Processing Time</p>
              <p className="text-lg font-bold">{center.metrics.averageProcessingTime} days</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Returns list */}
      <div className="flex-grow overflow-auto p-4">
        <h3 className="text-lg font-semibold mb-3">Recent Returns</h3>
        
        {Object.entries(returnsByStatus).map(([status, items]) => (
          items.length > 0 && (
            <div key={status} className="mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(status)}`}></span>
                {status} ({items.length})
              </h4>
              
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-md p-3 border border-gray-200">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900">{item.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(item.dateReturned)}</p>
                    </div>
                    
                    <div className="mt-2">
                      {item.items.map(product => (
                        <div key={product.id} className="flex justify-between items-center py-1 border-t border-gray-100 mt-1">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category} • {product.condition}</p>
                          </div>
                          <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 text-sm">
                      <p className="text-gray-700">
                        {item.customerName} • 
                        <span className="ml-1">{item.originCity}</span>
                      </p>
                      <p className={`font-medium ${getNextActionColor(item.nextAction)}`}>
                        {item.nextAction || 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
        
        {returns.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No returns found for this center
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Functions
function getStatusColor(status) {
  switch (status) {
    case 'Processed': return 'bg-emerald-500';
    case 'Under Review': return 'bg-amber-500';
    case 'In Process': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
}

function getNextActionColor(action) {
  if (!action) return 'text-gray-700';
  
  switch (action) {
    case 'Resale': return 'text-emerald-700';
    case 'Refurbishment': return 'text-blue-700';
    case 'Quality Assessment': return 'text-amber-700';
    default: return 'text-gray-700';
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: '2-digit'
  }).format(date);
}