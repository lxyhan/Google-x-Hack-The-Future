'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowUpRight, Search, Filter, X, Eye, ChevronDown } from 'lucide-react'
import StatusBadge from './status-badge'

export default function RecentReturnsTable({ returns, totalReturns, formatDate, showRuleOutcome }) {  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Function to open modal with the selected item
  const openProductModal = (returnItem) => {
    setSelectedItem(returnItem);
    setIsModalOpen(true);
  };
  
  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Function to format rule outcome for display
const formatRuleOutcome = (outcome) => {
  if (!outcome) return 'N/A';
  
  // Convert snake_case to Title Case and handle special formats
  if (outcome === 'APPROVED') return 'Approved';
  if (outcome === 'REJECTED') return 'Rejected';
  if (outcome === 'MANUAL_REVIEW') return 'Manual Review';
  if (outcome.startsWith('OUTCOME_')) return outcome.replace('OUTCOME_', '');
  if (outcome.startsWith('EMAIL_')) return `Email: ${outcome.replace('EMAIL_', '')}`;
  
  return outcome.replace(/_/g, ' ').replace(/\w\S*/g, 
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

// Function to get color based on rule outcome
const getRuleOutcomeColor = (outcome) => {
  if (!outcome) return 'bg-stone-100 text-stone-800';
  
  if (outcome === 'APPROVED') return 'bg-green-100 text-green-800';
  if (outcome === 'REJECTED') return 'bg-red-100 text-red-800';
  if (outcome === 'MANUAL_REVIEW') return 'bg-amber-100 text-amber-800';
  if (outcome.startsWith('OUTCOME_')) return 'bg-purple-100 text-purple-800';
  if (outcome.startsWith('EMAIL_')) return 'bg-blue-100 text-blue-800';
  
  return 'bg-stone-100 text-stone-800';
};
  return (
    <>
      <div className="bg-white shadow-md rounded-lg border border-stone-100 overflow-hidden">
        {/* Header with search and actions */}
        <div className="px-6 py-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-stone-800 text-lg">Recent Returns</h3>
            <p className="text-xs text-stone-500 mt-1">View and process the latest customer returns</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-stone-400" />
              </div>
              <input 
                type="text" 
                className="py-2 pl-10 pr-4 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full md:w-44 lg:w-64"
                placeholder="Search returns..."
              />
            </div>
            
            {/* Filter dropdown */}
            <button className="flex items-center gap-1 py-2 px-3 border border-stone-200 rounded-lg text-sm text-stone-700 hover:bg-stone-50">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Return ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Returned On
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Status
                </th>
                {showRuleOutcome && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Rule Outcome
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {returns.map((returnItem, index) => (
                <tr 
                  key={returnItem.id} 
                  className={`${returnItem.flag ? "bg-yellow-50" : index % 2 === 0 ? "bg-white" : "bg-stone-50/30"} hover:bg-stone-100/50 transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                    <div className="flex items-center">
                      {returnItem.id}
                      {returnItem.flag && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Flagged
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-medium">
                        {returnItem.customerName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-stone-900">{returnItem.customerName}</p>
                        <p className="text-xs text-stone-500">{returnItem.customerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-700">
                    <button 
                      onClick={() => openProductModal(returnItem)}
                      className="group inline-flex items-center text-stone-700 hover:text-green-600"
                    >
                      <span>
                        {returnItem.items.length === 1 
                          ? returnItem.items[0].name 
                          : `${returnItem.items[0].name} +${returnItem.items.length - 1} more`}
                      </span>
                      <Eye className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-stone-900">
                      ${returnItem.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                    {formatDate(returnItem.dateReturned)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={returnItem.status} />
                    </td>
                    {showRuleOutcome && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {returnItem.ruleProcessingResult ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRuleOutcomeColor(returnItem.ruleProcessingResult)}`}>
                            {formatRuleOutcome(returnItem.ruleProcessingResult)}
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400">Not processed</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      <button className="px-3 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 font-medium text-xs transition-colors">
                        View Details
                      </button>
                    </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table footer */}
        <div className="px-6 py-4 border-t border-stone-100 flex justify-between items-center">
          <div>
            <span className="text-sm text-stone-500">Showing <span className="font-medium text-stone-700">{returns.length}</span> of <span className="font-medium text-stone-700">{totalReturns || 0}</span> returns</span>
            <div className="text-xs text-stone-400 mt-1">Page 1 of {Math.ceil((totalReturns || 0) / 5)}</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm text-stone-500 px-3 py-1.5 border border-stone-200 rounded-md hover:bg-stone-50">
              Previous
            </button>
            <button className="text-sm text-stone-500 px-3 py-1.5 border border-stone-200 rounded-md hover:bg-stone-50">
              Next
            </button>
            <button className="ml-2 inline-flex items-center px-3 py-2 border border-green-700 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50">
              View All Returns
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Information Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-stone-800">Return Details</h3>
              <button 
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Left column with return info */}
                <div className="flex-1">
                  <div className="mb-6">
                    <p className="text-xs font-medium text-stone-500 uppercase">Order Information</p>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-stone-500">Order ID</p>
                        <p className="text-sm font-medium text-stone-900">{selectedItem.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-500">Return ID</p>
                        <p className="text-sm font-medium text-stone-900">{selectedItem.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-500">Purchase Date</p>
                        <p className="text-sm font-medium text-stone-900">{formatDate(selectedItem.datePurchased)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-500">Return Date</p>
                        <p className="text-sm font-medium text-stone-900">{formatDate(selectedItem.dateReturned)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-xs font-medium text-stone-500 uppercase">Customer</p>
                    <div className="mt-2 flex items-center">
                      <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-medium">
                        {selectedItem.customerName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-stone-900">{selectedItem.customerName}</p>
                        <p className="text-xs text-stone-500">{selectedItem.customerId}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-stone-500 uppercase">Return Status</p>
                    <div className="mt-2">
                      <StatusBadge status={selectedItem.status} />
                      {selectedItem.flag && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Flagged
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-stone-500">
                      {selectedItem.notes || "No additional notes available."}
                    </p>
                  </div>
                </div>
                
                {/* Right column with items */}
                <div className="flex-1">
                  <p className="text-xs font-medium text-stone-500 uppercase mb-3">Returned Items</p>
                  <div className="space-y-4">
                    {selectedItem.items.map((item, index) => (
                      <div key={index} className="border border-stone-200 rounded-lg p-4">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-stone-800">{item.name}</h4>
                          <p className="font-medium text-stone-700">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                          <div>
                            <span className="text-stone-500">SKU:</span> {item.sku}
                          </div>
                          <div>
                            <span className="text-stone-500">Category:</span> {item.category}
                          </div>
                          {item.size && (
                            <div>
                              <span className="text-stone-500">Size:</span> {item.size}
                            </div>
                          )}
                          {item.color && (
                            <div>
                              <span className="text-stone-500">Color:</span> {item.color}
                            </div>
                          )}
                          <div className="col-span-2">
                            <span className="text-stone-500">Condition:</span> {item.condition}
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-stone-100">
                          <p className="text-xs font-medium text-stone-500">Return Reason:</p>
                          <div className="mt-1 inline-block px-2 py-1 rounded bg-stone-100 text-xs text-stone-700">
                            {item.reason}
                          </div>
                          <p className="mt-2 text-xs text-stone-500">{item.reasonDetails}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-between">
              <button 
                onClick={closeModal}
                className="px-4 py-2 border border-stone-300 rounded-md text-stone-700 text-sm font-medium hover:bg-stone-100"
              >
                Close
              </button>
              <div>
                {selectedItem.status === 'In Process' && (
                  <button className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">
                    Process Return
                  </button>
                )}
                {selectedItem.status === 'Under Review' && (
                  <button className="ml-2 px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700">
                    Complete Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}