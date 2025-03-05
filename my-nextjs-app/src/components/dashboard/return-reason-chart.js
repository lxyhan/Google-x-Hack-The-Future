'use client'

export default function ReturnReasonChart({ data }) {
  // Generate a color based on the percentage (from green to amber to red)
  const getBarColor = (percentage) => {
    if (percentage > 35) return 'from-amber-500 to-red-500';
    if (percentage > 20) return 'from-amber-400 to-amber-500';
    return 'from-green-500 to-green-600';
  };

  // Simple icons for each reason
  const getIconForReason = (reason) => {
    switch(reason) {
      case "Doesn't fit":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 6L17 2M17 2L13 6M17 2V10M3 17.0322V16.5C3 12.9101 5.91015 10 9.5 10C13.0899 10 16 12.9101 16 16.5V17.0322" 
                  stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "Changed mind":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16H12.01M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" 
                  stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-stone-100 h-full">
      <h3 className="font-medium text-stone-800 mb-4">Return Reasons</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="group">
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center">
                {getIconForReason(item.reason) && (
                  <span className="mr-1.5">{getIconForReason(item.reason)}</span>
                )}
                <span className="text-stone-700">{item.reason}</span>
              </div>
              <span className="font-medium text-stone-800">{item.percentage}%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getBarColor(item.percentage)}`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}