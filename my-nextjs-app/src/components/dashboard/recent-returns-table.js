'use client'

import { AlertTriangle, ArrowUpRight } from 'lucide-react'
import StatusBadge from './status-badge'

export default function RecentReturnsTable({ returns, totalReturns, formatDate }) {
  return (
    <div className="bg-white shadow rounded-lg border border-stone-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100">
        <h3 className="font-medium text-stone-800">Recent Returns</h3>
      </div>
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-200">
            {returns.map((returnItem) => (
              <tr key={returnItem.id} className={returnItem.flag ? "bg-yellow-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                  {returnItem.id}
                  {returnItem.flag && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Flagged
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                  {returnItem.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                  {returnItem.items.length === 1 
                    ? returnItem.items[0].name 
                    : `${returnItem.items[0].name} +${returnItem.items.length - 1} more`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                  ${returnItem.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                  {formatDate(returnItem.dateReturned)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={returnItem.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                  <button className="text-green-600 hover:text-green-800 font-medium">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-stone-100 flex justify-between items-center">
        <span className="text-sm text-stone-500">Showing {returns.length} of {totalReturns || 0} returns</span>
        <button className="inline-flex items-center px-3 py-2 border border-green-700 text-sm font-medium rounded text-green-700 bg-white hover:bg-green-50">
          View All Returns
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}