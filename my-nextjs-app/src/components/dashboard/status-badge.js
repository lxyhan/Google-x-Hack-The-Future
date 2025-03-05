'use client'

import { CheckCircle, Clock, AlertTriangle, Package } from 'lucide-react'

export default function StatusBadge({ status }) {
  let color;
  let icon;
  
  switch(status) {
    case 'Processed':
      color = 'bg-green-100 text-green-800';
      icon = <CheckCircle className="h-4 w-4 mr-1 text-green-600" />;
      break;
    case 'In Process':
      color = 'bg-blue-100 text-blue-800';
      icon = <Clock className="h-4 w-4 mr-1 text-blue-600" />;
      break;
    case 'Under Review':
      color = 'bg-yellow-100 text-yellow-800';
      icon = <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />;
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
      icon = <Package className="h-4 w-4 mr-1 text-gray-600" />;
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {icon}
      {status}
    </span>
  );
}