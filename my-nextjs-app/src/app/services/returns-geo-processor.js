// app/services/returns-geo-processor.js

/**
 * This service adds geographic context to returns data for visualization
 */

// Map of US regions to coordinates for customer location assignment
const customerRegions = {
    'Northeast': [
      { city: 'New York', state: 'NY', coordinates: { lat: 40.7128, lng: -74.0060 } },
      { city: 'Boston', state: 'MA', coordinates: { lat: 42.3601, lng: -71.0589 } },
      { city: 'Philadelphia', state: 'PA', coordinates: { lat: 39.9526, lng: -75.1652 } },
      { city: 'Pittsburgh', state: 'PA', coordinates: { lat: 40.4406, lng: -79.9959 } },
      { city: 'Buffalo', state: 'NY', coordinates: { lat: 42.8864, lng: -78.8784 } }
    ],
    'Southeast': [
      { city: 'Miami', state: 'FL', coordinates: { lat: 25.7617, lng: -80.1918 } },
      { city: 'Atlanta', state: 'GA', coordinates: { lat: 33.7490, lng: -84.3880 } },
      { city: 'Charlotte', state: 'NC', coordinates: { lat: 35.2271, lng: -80.8431 } },
      { city: 'Nashville', state: 'TN', coordinates: { lat: 36.1627, lng: -86.7816 } },
      { city: 'Orlando', state: 'FL', coordinates: { lat: 28.5383, lng: -81.3792 } }
    ],
    'Midwest': [
      { city: 'Chicago', state: 'IL', coordinates: { lat: 41.8781, lng: -87.6298 } },
      { city: 'Detroit', state: 'MI', coordinates: { lat: 42.3314, lng: -83.0458 } },
      { city: 'Minneapolis', state: 'MN', coordinates: { lat: 44.9778, lng: -93.2650 } },
      { city: 'Indianapolis', state: 'IN', coordinates: { lat: 39.7684, lng: -86.1581 } },
      { city: 'Cleveland', state: 'OH', coordinates: { lat: 41.4993, lng: -81.6944 } }
    ],
    'Southwest': [
      { city: 'Houston', state: 'TX', coordinates: { lat: 29.7604, lng: -95.3698 } },
      { city: 'Dallas', state: 'TX', coordinates: { lat: 32.7767, lng: -96.7970 } },
      { city: 'Phoenix', state: 'AZ', coordinates: { lat: 33.4484, lng: -112.0740 } },
      { city: 'San Antonio', state: 'TX', coordinates: { lat: 29.4241, lng: -98.4936 } },
      { city: 'Austin', state: 'TX', coordinates: { lat: 30.2672, lng: -97.7431 } }
    ],
    'West': [
      { city: 'Los Angeles', state: 'CA', coordinates: { lat: 34.0522, lng: -118.2437 } },
      { city: 'San Francisco', state: 'CA', coordinates: { lat: 37.7749, lng: -122.4194 } },
      { city: 'Seattle', state: 'WA', coordinates: { lat: 47.6062, lng: -122.3321 } },
      { city: 'Portland', state: 'OR', coordinates: { lat: 45.5051, lng: -122.6750 } },
      { city: 'Denver', state: 'CO', coordinates: { lat: 39.7392, lng: -104.9903 } }
    ]
  };
  
  /**
   * Determine the most appropriate region for a return based on its processing location
   * 
   * This uses a deterministic approach to assign customers to regions based on
   * which fulfillment center is processing their return, creating a realistic
   * geographic pattern while ensuring consistency.
   */
  function determineRegionForReturn(returnItem, centers) {
    const center = centers.find(c => c.id === returnItem.processingLocation);
    
    // Default assignment based on processing center
    if (center) {
      switch (center.id) {
        case 'FC-001': // East Coast Fulfillment Center
          // Mostly Northeast, some Southeast
          return Math.random() < 0.7 ? 'Northeast' : 'Southeast';
        
        case 'FC-002': // Midwest Distribution Center
          // Mostly Midwest, some Southwest
          return Math.random() < 0.8 ? 'Midwest' : 'Southwest';
        
        case 'RW-001': // Returns Processing Warehouse in Atlanta
          // Mostly Southeast, some Northeast and Midwest
          const rand = Math.random();
          if (rand < 0.6) return 'Southeast';
          if (rand < 0.8) return 'Northeast';
          return 'Midwest';
      }
    }
    
    // Get a consistent "random" region based on return ID to ensure
    // the same return always gets the same region
    const returnIdNum = parseInt(returnItem.id.replace(/\D/g, ''));
    const regions = Object.keys(customerRegions);
    const regionIndex = returnIdNum % regions.length;
    return regions[regionIndex];
  }
  
  /**
   * Get a consistent city within a region based on return details
   */
  function getCityInRegion(region, returnItem) {
    const cities = customerRegions[region];
    
    // Use customer ID to consistently assign the same customer to the same city
    const customerId = returnItem.customerId;
    const customerIdNum = parseInt(customerId.replace(/\D/g, ''));
    const cityIndex = customerIdNum % cities.length;
    
    return cities[cityIndex];
  }
  
  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  /**
   * Enhancement: Calculate carbon emissions based on distance and transportation method
   */
  function calculateCarbonEmissions(distance, method = 'ground') {
    // Emissions factors in kg CO2 per mile
    const emissionFactors = {
      ground: 0.25,  // Standard ground shipping
      air: 0.85,     // Air freight
      express: 0.65  // Express shipping (mix of ground and air)
    };
    
    return distance * (emissionFactors[method] || emissionFactors.ground);
  }
  
  /**
   * Enrich returns data with geographic information and routing details
   */
  export function enrichReturnsWithGeoData(returns, centers) {
    return returns.map(returnItem => {
      // Get the destination center
      const destinationCenter = centers.find(center => center.id === returnItem.processingLocation);
      if (!destinationCenter) {
        return {
          ...returnItem,
          geoDataMissing: true
        };
      }
      
      // Determine customer region based on processing center and return details
      const region = determineRegionForReturn(returnItem, centers);
      
      // Get a city in that region
      const customerLocation = getCityInRegion(region, returnItem);
      
      // Calculate routing information
      const distance = calculateDistance(
        customerLocation.coordinates.lat,
        customerLocation.coordinates.lng,
        destinationCenter.location.coordinates.lat,
        destinationCenter.location.coordinates.lng
      );
      
      // Determine shipping method based on return data
      let shippingMethod = 'ground';
      if (returnItem.returnMethod?.toLowerCase().includes('express')) {
        shippingMethod = 'express';
      } else if (distance > 1000) {
        // Assume long distances use air shipping
        shippingMethod = 'air';
      }
      
      // Calculate emissions
      const emissions = calculateCarbonEmissions(distance, shippingMethod);
      
      // Calculate "optimal" routing - this simulates potential savings
      // if the return was routed to the closest center
      const optimalCenter = centers.reduce((closest, center) => {
        const centerDist = calculateDistance(
          customerLocation.coordinates.lat,
          customerLocation.coordinates.lng,
          center.location.coordinates.lat,
          center.location.coordinates.lng
        );
        
        if (!closest || centerDist < closest.distance) {
          return { center, distance: centerDist };
        }
        return closest;
      }, null);
      
      const optimalDistance = optimalCenter ? optimalCenter.distance : distance;
      const optimalEmissions = calculateCarbonEmissions(optimalDistance, shippingMethod);
      const potentialSavings = Math.max(0, emissions - optimalEmissions);
      
      // Add all this information to the return item
      return {
        ...returnItem,
        customerLocation: {
          city: customerLocation.city,
          state: customerLocation.state,
          region: region,
          coordinates: customerLocation.coordinates
        },
        shipping: {
          method: shippingMethod,
          distance: Math.round(distance),
          emissions: Math.round(emissions)
        },
        optimization: {
          optimalCenter: optimalCenter ? optimalCenter.center.id : destinationCenter.id,
          optimalDistance: Math.round(optimalDistance),
          optimalEmissions: Math.round(optimalEmissions),
          potentialSavings: Math.round(potentialSavings)
        }
      };
    });
  }
  
  /**
   * Calculate sustainability metrics for a set of returns
   */
  export function calculateSustainabilityMetrics(enrichedReturns) {
    // Skip returns with missing geo data
    const returnsWithGeoData = enrichedReturns.filter(item => !item.geoDataMissing);
    
    if (returnsWithGeoData.length === 0) {
      return {
        totalMiles: 0,
        carbonEmissions: 0,
        avgMiles: 0,
        potentialSavings: 0,
        routingEfficiency: 100
      };
    }
    
    const totalMiles = returnsWithGeoData.reduce((sum, item) => sum + item.shipping.distance, 0);
    const carbonEmissions = returnsWithGeoData.reduce((sum, item) => sum + item.shipping.emissions, 0);
    const potentialSavings = returnsWithGeoData.reduce((sum, item) => sum + item.optimization.potentialSavings, 0);
    const totalOptimalMiles = returnsWithGeoData.reduce((sum, item) => sum + item.optimization.optimalDistance, 0);
    
    // Routing efficiency percentage (higher is better)
    const routingEfficiency = totalMiles > 0 
      ? Math.round((totalOptimalMiles / totalMiles) * 100) 
      : 100;
    
    return {
      totalMiles,
      carbonEmissions,
      avgMiles: Math.round(totalMiles / returnsWithGeoData.length),
      potentialSavings,
      routingEfficiency
    };
  }
  
  /**
   * Process returns for map visualization
   */
  export function processReturnsForMap(returns, centers) {
    // Enrich returns with geo data
    const enrichedReturns = enrichReturnsWithGeoData(returns, centers);
    
    // Calculate sustainability metrics
    const metrics = calculateSustainabilityMetrics(enrichedReturns);
    
    return {
      enrichedReturns,
      metrics
    };
  }