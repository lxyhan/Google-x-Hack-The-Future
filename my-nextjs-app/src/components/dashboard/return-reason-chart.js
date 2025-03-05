'use client'

export default function ReturnReasonChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-stone-100 h-full">
      <h3 className="font-medium text-stone-800 mb-4">Return Reasons</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.reason}</span>
              <span className="font-medium">{item.percentage}%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}