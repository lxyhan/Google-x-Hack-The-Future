import React, { useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import MapView from './mapview';
import FulfillmentCentersList from './fulfillmentcenterlist';
import SustainabilityMetrics from './sustainabilitymetrics';
import CenterDetailsPanel from './centerdetails';
// Import the data and helper functions directly
import { 
  getReturnsWithLocations, 
  getFulfillmentCenters 
} from '../../app/api/returns/data';

export default function LogisticsMapContent() {
  const [loading, setLoading] = useState(true);
  const [centers, setCenters] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [activeCenter, setActiveCenter] = useState(null);
  const [returnCategories, setReturnCategories] = useState({
    total: 0,
    'Resale': 0,
    'Refurbishment': 0,
    'Recycle': 0,
    'Damaged/Write-off': 0
  });
  const [sustainabilityStats, setSustainabilityStats] = useState({
    totalMiles: 0,
    carbonEmissions: 0,
    avgMiles: 0,
    potentialSavings: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the imported helper functions
        const centersData = await getFulfillmentCenters();
        const returnsWithLocations = await getReturnsWithLocations();
        
        // Calculate sustainability metrics
        const metrics = calculateSustainabilityMetrics(returnsWithLocations);
        
        // Calculate global return categories
        const categories = calculateReturnCategories(returnsWithLocations);
        
        // Update state
        setCenters(centersData);
        setReturnItems(returnsWithLocations);
        setSustainabilityStats(metrics);
        setReturnCategories(categories);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle center selection
  const handleCenterClick = (center) => {
    setActiveCenter(center);
    
    // Update return categories for this center
    const centerCategories = getCenterCategories(center);
    setReturnCategories(centerCategories);
  };

  // Reset center selection
  const resetView = () => {
    setActiveCenter(null);
    
    // Reset to global categories
    const globalCategories = calculateReturnCategories(returnItems);
    setReturnCategories(globalCategories);
  };

  // Get stats for a specific center
  const getCenterStats = (center) => {
    // Default empty stats in case of errors
    if (!center || !returnItems) {
      return {
        totalReturns: 0,
        totalValue: "0.00",
        shipping: null,
        returns: []
      };
    }
    
    const centerReturns = returnItems.filter(item => item.processingLocation === center.id);
    
    const totalReturns = centerReturns.length;
    const totalValue = centerReturns.reduce((sum, item) => {
      return sum + item.items.reduce((itemSum, i) => itemSum + (i.price * (i.quantity || 1)), 0);
    }, 0);
    
    // Calculate center-specific shipping metrics if available
    const hasShippingData = centerReturns.some(item => item.shipping);
    const shippingMetrics = hasShippingData ? {
      totalDistance: centerReturns.reduce((sum, item) => sum + (item.shipping?.distance || 0), 0),
      avgDistance: centerReturns.length > 0 ? 
        Math.round(centerReturns.reduce((sum, item) => sum + (item.shipping?.distance || 0), 0) / centerReturns.length) : 0,
      totalEmissions: centerReturns.reduce((sum, item) => sum + (item.shipping?.emissions || 0), 0)
    } : null;
    
    return {
      totalReturns,
      totalValue: totalValue.toFixed(2),
      shipping: shippingMetrics,
      returns: centerReturns
    };
  };

  // Calculate return categories for a specific center
  const getCenterCategories = (center) => {
    if (!center || !returnItems) {
      return {
        total: 0,
        'Resale': 0,
        'Refurbishment': 0,
        'Recycle': 0,
        'Damaged/Write-off': 0
      };
    }
    
    const centerReturns = returnItems.filter(item => item.processingLocation === center.id);
    
    return {
      total: centerReturns.length,
      'Resale': centerReturns.filter(item => getReturnType(item) === 'Resale').length,
      'Refurbishment': centerReturns.filter(item => getReturnType(item) === 'Refurbishment').length,
      'Recycle': centerReturns.filter(item => getReturnType(item) === 'Recycle').length,
      'Damaged/Write-off': centerReturns.filter(item => getReturnType(item) === 'Damaged/Write-off').length
    };
  };

  // Calculate return categories for all returns
  const calculateReturnCategories = (returns) => {
    if (!returns || returns.length === 0) {
      return {
        total: 0,
        'Resale': 0,
        'Refurbishment': 0,
        'Recycle': 0,
        'Damaged/Write-off': 0
      };
    }
    
    const categories = {
      total: returns.length,
      'Resale': 0,
      'Refurbishment': 0,
      'Recycle': 0,
      'Damaged/Write-off': 0
    };
    
    returns.forEach(item => {
      const type = getReturnType(item);
      if (categories[type] !== undefined) {
        categories[type]++;
      }
    });
    
    return categories;
  };

  // Calculate sustainability metrics
  const calculateSustainabilityMetrics = (returns) => {
    // Filter returns that have shipping data
    if (!returns || returns.length === 0) {
      return {
        totalMiles: 0,
        carbonEmissions: 0,
        avgMiles: 0,
        potentialSavings: 0
      };
    }
    
    const returnsWithShipping = returns.filter(item => item.shipping);
    
    if (returnsWithShipping.length === 0) {
      return {
        totalMiles: 0,
        carbonEmissions: 0,
        avgMiles: 0,
        potentialSavings: 0
      };
    }
    
    const totalMiles = returnsWithShipping.reduce((sum, item) => sum + item.shipping.distance, 0);
    const carbonEmissions = returnsWithShipping.reduce((sum, item) => sum + item.shipping.emissions, 0);
    const avgMiles = Math.round(totalMiles / returnsWithShipping.length);
    
    // Calculate potential savings (estimation)
    const potentialSavings = Math.round(carbonEmissions * 0.25);
    
    return {
      totalMiles,
      carbonEmissions,
      avgMiles,
      potentialSavings
    };
  };

  // Determine return type from nextAction or other properties
  const getReturnType = (item) => {
    if (!item) return 'Unknown';
    
    if (item.nextAction === 'Resale') return 'Resale';
    if (item.nextAction === 'Refurbishment') return 'Refurbishment';
    if (item.nextAction === 'Quality Assessment') return 'Damaged/Write-off';
    
    // Fallback based on item condition
    const condition = item.items && item.items[0]?.condition?.toLowerCase() || '';
    if (condition.includes('new') || condition.includes('tags')) return 'Resale';
    if (condition.includes('worn') || condition.includes('used')) return 'Refurbishment';
    return 'Recycle';
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (activeCenter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeCenter]);

  return (
    <div className="flex flex-col h-screen p-4 max-h-screen">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Map className="mr-2 h-6 w-6 text-indigo-600" />
          Returns Logistics Map
        </h1>
      </div>
      
      {/* Sustainability metrics */}
      <div className="flex-shrink-0 mb-4">
        <SustainabilityMetrics stats={sustainabilityStats} />
      </div>
      
      {/* Main content area - explicitly sized */}
      <div className="flex-1 min-h-0" style={{ height: 'calc(100vh - 180px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          {/* Fulfillment centers sidebar */}
          <div className="lg:col-span-1 h-full overflow-hidden">
            <FulfillmentCentersList 
              centers={centers}
              getStats={getCenterStats}
              activeCenter={activeCenter}
              onCenterClick={handleCenterClick}
              categories={returnCategories}
            />
          </div>
          
          {/* Map container with explicit height */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow h-full">
            <div className="h-full w-full" id="map-container">
              <MapView 
                centers={centers}
                returns={returnItems}
                loading={loading}
                activeCenter={activeCenter}
                onCenterChange={setActiveCenter}
                getReturnType={getReturnType}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Center details panel (shown when a center is selected) with backdrop blur */}
      {activeCenter && (
        <div className="fixed inset-0 z-50">
          {/* Semi-transparent backdrop with blur */}
          <div 
            className="absolute inset-0 backdrop-filter backdrop-blur-sm bg-white/30"
            onClick={resetView} // Close when clicking backdrop
          />
          
          {/* Modal content */}
          <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto pointer-events-auto">
              <CenterDetailsPanel
                center={activeCenter}
                returns={returnItems.filter(item => item.processingLocation === activeCenter.id)}
                onClose={resetView}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}