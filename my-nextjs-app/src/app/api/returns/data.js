// app/api/returns/data.js

// Define customer locations to be used consistently with each return
const customerLocations = {
  "CUST-45632": { // Emily Johnson
    city: "Boston",
    state: "MA",
    coordinates: { lat: 42.3601, lng: -71.0589 }
  },
  "CUST-28754": { // Michael Chen
    city: "New York",
    state: "NY",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  "CUST-36985": { // Sophia Martinez
    city: "Miami",
    state: "FL",
    coordinates: { lat: 25.7617, lng: -80.1918 }
  },
  "CUST-12857": { // James Wilson
    city: "Chicago",
    state: "IL",
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },
  "CUST-39854": { // Olivia Thompson
    city: "San Francisco",
    state: "CA",
    coordinates: { lat: 37.7749, lng: -122.4194 }
  }
};

export const returnsData = {
  company: {
    name: "NorthStyle Apparel",
    id: "NSA-12345",
    industry: "Fashion Retail",
    tier: "Enterprise",
    returnPolicy: {
      standardDays: 30,
      premiumDays: 60,
      restrictedCategories: ["Intimates", "Final Sale"],
      requiresReceipt: true,
      allowsPartialReturn: true
    },
    locations: [
      { id: "FC-001", name: "East Coast Fulfillment Center", city: "Newark", state: "NJ", type: "fulfillment" },
      { id: "FC-002", name: "Midwest Distribution Center", city: "Columbus", state: "OH", type: "fulfillment" },
      { id: "RW-001", name: "Returns Processing Warehouse", city: "Atlanta", state: "GA", type: "returns" }
    ],
    customRules: [
      { id: "R1", name: "High-Value Item Review", threshold: 250, action: "manual_review" },
      { id: "R2", name: "Frequent Returner Flag", count: 5, period: 30, action: "flag_account" },
      { id: "R3", name: "Seasonal Return Extension", seasonStart: "11-15", seasonEnd: "12-31", extendedDays: 45 }
    ]
  },
  
  // Overall return statistics
  statistics: {
    overall: {
      total: 2487,
      approved: 2298,
      denied: 67,
      pending: 122,
      fraudSuspected: 32,
      totalValue: 189253.45,
      averageProcessingTime: 2.3 // days
    },
    byTimeframe: {
      daily: [42, 38, 56, 61, 47, 35, 28], // last 7 days
      weekly: [312, 295, 328, 301, 290], // last 5 weeks
      monthly: [2487, 2310, 2156, 2278, 2511, 2345] // last 6 months
    },
    byReason: [
      { reason: "Doesn't fit", percentage: 42, count: 1045 },
      { reason: "Changed mind", percentage: 27, count: 672 },
      { reason: "Defective", percentage: 14, count: 348 },
      { reason: "Not as described", percentage: 11, count: 274 },
      { reason: "Arrived late", percentage: 6, count: 148 }
    ],
    byCategory: [
      { category: "Tops", percentage: 38, count: 945 },
      { category: "Bottoms", percentage: 26, count: 647 },
      { category: "Outerwear", percentage: 18, count: 448 },
      { category: "Accessories", percentage: 12, count: 298 },
      { category: "Footwear", percentage: 6, count: 149 }
    ],
    byProcessingStatus: [
      { status: "Refunded", percentage: 72, count: 1791 },
      { status: "Resale", percentage: 18, count: 448 },
      { status: "Refurbishment", percentage: 6, count: 149 },
      { status: "Damaged/Write-off", percentage: 4, count: 99 }
    ],
    fraudMetrics: {
      highRiskPercentage: 4.8,
      flaggedAccounts: 18,
      suspiciousPatterns: 7,
      preventedFraudValue: 12450.75
    }
  },
  
  // Recent return items
  recentReturns: [
    {
      id: "RTN-78542",
      customerName: "Emily Johnson",
      customerId: "CUST-45632",
      items: [
        {
          id: "ITM-98765",
          name: "Cashmere Blend Turtleneck Sweater",
          sku: "CBS-TN-M-GRY",
          category: "Tops",
          subcategory: "Sweaters",
          size: "Medium",
          color: "Heather Gray",
          price: 89.99,
          quantity: 1,
          condition: "Like New",
          reason: "Doesn't fit",
          reasonDetails: "Too large in the shoulders"
        }
      ],
      orderNumber: "ORD-123456",
      datePurchased: "2025-02-10T08:30:00Z",
      dateReturned: "2025-02-18T14:22:33Z",
      returnMethod: "Mail",
      status: "Processed",
      processingLocation: "RW-001",
      refundAmount: 89.99,
      refundMethod: "Original Payment",
      nextAction: "Resale",
      notes: "Item in perfect condition, can be restocked immediately"
    },
    {
      id: "RTN-78543",
      customerName: "Michael Chen",
      customerId: "CUST-28754",
      items: [
        {
          id: "ITM-87432",
          name: "Slim-Fit Performance Chinos",
          sku: "SF-PC-32-KHK",
          category: "Bottoms",
          subcategory: "Pants",
          size: "32W x 30L",
          color: "Khaki",
          price: 65.50,
          quantity: 1,
          condition: "Like New",
          reason: "Changed mind",
          reasonDetails: "Found similar item elsewhere"
        },
        {
          id: "ITM-34985",
          name: "Merino Wool Blend Socks",
          sku: "MW-SCK-L-NVY",
          category: "Accessories",
          subcategory: "Socks",
          size: "Large",
          color: "Navy",
          price: 18.99,
          quantity: 2,
          condition: "New with tags",
          reason: "Changed mind",
          reasonDetails: "Color doesn't match expectation"
        }
      ],
      orderNumber: "ORD-234567",
      datePurchased: "2025-02-12T12:15:45Z",
      dateReturned: "2025-02-20T10:45:22Z",
      returnMethod: "In-Store",
      status: "Processed",
      processingLocation: "FC-001",
      refundAmount: 103.48,
      refundMethod: "Store Credit",
      nextAction: "Resale",
      notes: "Customer requested store credit instead of card refund"
    },
    {
      id: "RTN-78544",
      customerName: "Sophia Martinez",
      customerId: "CUST-36985",
      returnFrequency: "High",
      items: [
        {
          id: "ITM-65432",
          name: "Waterproof Mountain Parka",
          sku: "WMP-L-GRN",
          category: "Outerwear",
          subcategory: "Jackets",
          size: "Large",
          color: "Forest Green",
          price: 249.99,
          quantity: 1,
          condition: "Used",
          reason: "Defective",
          reasonDetails: "Zipper broke after second use",
          defectImages: ["defect_img_78544_1.jpg", "defect_img_78544_2.jpg"]
        }
      ],
      orderNumber: "ORD-345678",
      datePurchased: "2025-01-30T15:22:10Z",
      dateReturned: "2025-02-22T09:18:45Z",
      returnMethod: "Mail",
      status: "Under Review",
      processingLocation: "RW-001",
      refundAmount: null,
      refundMethod: null,
      nextAction: "Quality Assessment",
      riskScore: 68,
      notes: "Customer has returned 5 jackets in the past 3 months. Flagged for review.",
      flag: "Frequent returner"
    },
    {
      id: "RTN-78545",
      customerName: "James Wilson",
      customerId: "CUST-12857",
      items: [
        {
          id: "ITM-54321",
          name: "Premium Leather Chelsea Boots",
          sku: "PL-CB-10-BRN",
          category: "Footwear",
          subcategory: "Boots",
          size: "10",
          color: "Brown",
          price: 225.00,
          quantity: 1,
          condition: "Lightly worn",
          reason: "Doesn't fit",
          reasonDetails: "Too narrow"
        }
      ],
      orderNumber: "ORD-456789",
      datePurchased: "2025-02-05T11:30:25Z",
      dateReturned: "2025-02-15T16:40:12Z",
      returnMethod: "Mail",
      status: "Processed",
      processingLocation: "RW-001",
      refundAmount: 225.00,
      refundMethod: "Original Payment",
      nextAction: "Refurbishment",
      notes: "Light wear on soles, needs cleaning before restocking"
    },
    {
      id: "RTN-78546",
      customerName: "Olivia Thompson",
      customerId: "CUST-39854",
      items: [
        {
          id: "ITM-23456",
          name: "Organic Cotton T-Shirt",
          sku: "OCT-S-WHT",
          category: "Tops",
          subcategory: "T-Shirts",
          size: "Small",
          color: "White",
          price: 29.99,
          quantity: 2,
          condition: "New with tags",
          reason: "Not as described",
          reasonDetails: "Material is thinner than expected"
        },
        {
          id: "ITM-34567",
          name: "Recycled Polyester Activewear Leggings",
          sku: "RPA-M-BLK",
          category: "Bottoms",
          subcategory: "Activewear",
          size: "Medium",
          color: "Black",
          price: 58.50,
          quantity: 1,
          condition: "New with tags",
          reason: "Doesn't fit",
          reasonDetails: "Too long"
        }
      ],
      orderNumber: "ORD-567890",
      datePurchased: "2025-02-14T09:45:33Z",
      dateReturned: "2025-02-24T13:12:55Z",
      returnMethod: "Mail",
      status: "In Process",
      processingLocation: "FC-002",
      refundAmount: null,
      refundMethod: null,
      nextAction: "Quality Check",
      notes: "Standard return, awaiting inspection"
    }
  ],
  
  // AI-generated insights
  insights: [
    {
      type: "trend",
      title: "Rising Return Rate in Sweaters",
      description: "Cashmere blend sweaters show 15% higher return rate than other materials",
      recommendations: [
        "Review sizing guide for sweaters",
        "Add more detailed fabric information to product listings"
      ],
      priority: "Medium",
      potentialImpact: "$5,200 monthly"
    },
    {
      type: "fraud",
      title: "Potential Return Fraud Pattern Detected",
      description: "3 customers with similar return patterns and addresses",
      recommendations: [
        "Implement manual review for these accounts",
        "Consider requesting photo evidence for future returns"
      ],
      priority: "High",
      potentialImpact: "$2,800 monthly"
    },
    {
      type: "inventory",
      title: "Seasonal Stock Adjustment Needed",
      description: "Heavy winter jackets showing higher than average returns as spring approaches",
      recommendations: [
        "Consider discount promotion to reduce returns",
        "Adjust upcoming order quantities"
      ],
      priority: "Medium",
      potentialImpact: "$8,500 one-time"
    },
    {
      type: "customer",
      title: "High-Value Customer Return Issue",
      description: "VIP customer James Wilson (annual spend $4,200+) has returned 3 items citing fit issues",
      recommendations: [
        "Offer personalized sizing consultation",
        "Consider courtesy discount on next purchase"
      ],
      priority: "High",
      potentialImpact: "Customer retention, $4,200+ annual"
    }
  ],
  
  // Fulfillment centers and locations data
  fulfillmentCenters: [
    {
      id: "FC-001",
      name: "East Coast Fulfillment Center",
      location: {
        address: "123 Logistics Way",
        city: "Newark",
        state: "NJ",
        zip: "07102",
        coordinates: {
          lat: 40.735657,
          lng: -74.172363
        }
      },
      capacity: {
        total: 50000, // square feet
        utilized: 42500
      },
      inventory: {
        skuCount: 3250,
        totalItems: 125000,
        returnProcessingArea: 5000 // square feet
      },
      staffing: {
        total: 75,
        returnsTeam: 12
      },
      metrics: {
        averageProcessingTime: 1.8, // days
        dailyReturnVolume: 120,
        returnResaleRate: 68 // percentage
      }
    },
    {
      id: "FC-002",
      name: "Midwest Distribution Center",
      location: {
        address: "456 Warehouse Blvd",
        city: "Columbus",
        state: "OH",
        zip: "43219",
        coordinates: {
          lat: 39.984705,
          lng: -82.878292
        }
      },
      capacity: {
        total: 65000, // square feet
        utilized: 52000
      },
      inventory: {
        skuCount: 4150,
        totalItems: 185000,
        returnProcessingArea: 7500 // square feet
      },
      staffing: {
        total: 95,
        returnsTeam: 18
      },
      metrics: {
        averageProcessingTime: 1.6, // days
        dailyReturnVolume: 185,
        returnResaleRate: 72 // percentage
      }
    },
    {
      id: "RW-001",
      name: "Returns Processing Warehouse",
      location: {
        address: "789 Returns Road",
        city: "Atlanta",
        state: "GA",
        zip: "30339",
        coordinates: {
          lat: 33.885242,
          lng: -84.468736
        }
      },
      capacity: {
        total: 35000, // square feet
        utilized: 28000
      },
      inventory: {
        skuCount: 2800,
        totalItems: 95000,
        returnProcessingArea: 20000 // square feet
      },
      staffing: {
        total: 65,
        returnsTeam: 45
      },
      metrics: {
        averageProcessingTime: 1.2, // days
        dailyReturnVolume: 350,
        returnResaleRate: 78 // percentage
      }
    }
  ]
};

// Helper function to get customer location data
function getCustomerLocation(customerId) {
  return customerLocations[customerId] || null;
}

// Calculate distance between two coordinates using Haversine formula
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

// Helper function to simulate API data fetching
export async function getReturnsData() {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  return returnsData;
}

// Helper to get only recent returns
export async function getRecentReturns() {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  return returnsData.recentReturns;
}

// Helper to get returns with location data included
export async function getReturnsWithLocations() {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 350));
  
  // Get returns and add location data
  const returns = returnsData.recentReturns.map(returnItem => {
    // Get customer location
    const customerLocation = getCustomerLocation(returnItem.customerId);
    
    // Get fulfillment center location
    const processingCenter = returnsData.fulfillmentCenters.find(
      center => center.id === returnItem.processingLocation
    );
    
    if (!customerLocation || !processingCenter) {
      return returnItem;
    }
    
    // Calculate distance and shipping metrics
    const distance = calculateDistance(
      customerLocation.coordinates.lat,
      customerLocation.coordinates.lng,
      processingCenter.location.coordinates.lat,
      processingCenter.location.coordinates.lng
    );
    
    // Determine shipping method based on distance and return data
    let shippingMethod = "ground";
    if (returnItem.returnMethod?.toLowerCase().includes('express')) {
      shippingMethod = "express";
    } else if (distance > 800) {
      shippingMethod = "air";
    }
    
    // Calculate carbon footprint (simple estimation)
    const emissionFactors = {
      ground: 0.25,  // kg CO2 per mile
      air: 0.85,
      express: 0.65
    };
    const emissions = distance * (emissionFactors[shippingMethod] || emissionFactors.ground);
    
    // Add this data to the return item
    return {
      ...returnItem,
      origin: {
        ...customerLocation,
        coordinates: customerLocation.coordinates
      },
      shipping: {
        method: shippingMethod,
        distance: Math.round(distance),
        emissions: Math.round(emissions)
      }
    };
  });
  
  return returns;
}

// Helper to get only statistics
export async function getReturnStatistics() {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 200));
  return returnsData.statistics;
}

// Helper to get only insights
export async function getReturnInsights() {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 150));
  return returnsData.insights;
}

// Helper to get fulfillment centers
export async function getFulfillmentCenters() {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 200));
  return returnsData.fulfillmentCenters;
}