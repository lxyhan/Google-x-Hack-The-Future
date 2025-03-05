// mockData.js
// Mock data for Returns Management Dashboard

// Helper functions to generate random data
const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  
  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };
  
  // Constants for random data generation
  const productCategories = ['Electronics', 'Clothing', 'Home Goods', 'Furniture', 'Toys', 'Beauty', 'Books', 'Sports'];
  const productSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const productColors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Grey', 'Purple', 'Yellow', 'Orange', 'Pink'];
  const returnReasons = [
    'Defective', 
    'Wrong Item', 
    'Wrong Size', 
    'Changed Mind', 
    'Better Price Elsewhere', 
    'Gift Not Wanted', 
    'Arrived Late', 
    'Damaged in Transit', 
    'Not As Described',
    'Missing Parts'
  ];
  const itemConditions = ['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'];
  const fulfillmentCenters = [
    { id: 'FC001', name: 'Northeast Distribution', location: 'New York, NY' },
    { id: 'FC002', name: 'Midwest Logistics', location: 'Chicago, IL' },
    { id: 'FC003', name: 'Southern Warehouse', location: 'Atlanta, GA' },
    { id: 'FC004', name: 'West Coast Hub', location: 'Los Angeles, CA' },
    { id: 'FC005', name: 'Pacific Northwest Center', location: 'Seattle, WA' },
    { id: 'FC006', name: 'Mountain Region Depot', location: 'Denver, CO' },
    { id: 'FC007', name: 'Gulf Coast Storage', location: 'Houston, TX' }
  ];
  const customers = [
    { id: 'C001', name: 'TechGiant Corp', contactPerson: 'John Smith', tier: 'Enterprise' },
    { id: 'C002', name: 'Retail Solutions Inc', contactPerson: 'Emily Johnson', tier: 'Premium' },
    { id: 'C003', name: 'Global Merchants LLC', contactPerson: 'Michael Chen', tier: 'Standard' },
    { id: 'C004', name: 'FashionWorld Stores', contactPerson: 'Sarah Miller', tier: 'Enterprise' },
    { id: 'C005', name: 'HomeStyle Outlets', contactPerson: 'David Wilson', tier: 'Premium' },
    { id: 'C006', name: 'BookSmart Retailers', contactPerson: 'Jessica Brown', tier: 'Standard' },
    { id: 'C007', name: 'SportWare Distributors', contactPerson: 'Robert Garcia', tier: 'Premium' }
  ];
  const employees = [
    { id: 'E001', name: 'Alice Thompson', position: 'Returns Specialist' },
    { id: 'E002', name: 'Bob Jackson', position: 'Logistics Coordinator' },
    { id: 'E003', name: 'Carol Martinez', position: 'Quality Inspector' },
    { id: 'E004', name: 'Daniel Lee', position: 'Warehouse Manager' },
    { id: 'E005', name: 'Emma Davis', position: 'Returns Specialist' },
    { id: 'E006', name: 'Frank Rodriguez', position: 'Logistics Coordinator' },
    { id: 'E007', name: 'Grace Kim', position: 'Quality Inspector' }
  ];
  
  // Generate random return items
  const generateReturnItems = (count) => {
    const items = [];
    
    for (let i = 0; i < count; i++) {
      const purchaseDate = generateRandomDate(new Date(2023, 0, 1), new Date(2024, 2, 1));
      const returnDate = generateRandomDate(purchaseDate, new Date(2024, 2, 28));
      const customer = getRandomElement(customers);
      const fulfillmentCenter = getRandomElement(fulfillmentCenters);
      const category = getRandomElement(productCategories);
      const reason = getRandomElement(returnReasons);
      const condition = getRandomElement(itemConditions);
      const price = Math.round(Math.random() * 300) + 10; // $10 to $310
      
      // Generate a structured product name based on category
      let productName;
      let productAttributes = {};
      
      switch (category) {
        case 'Electronics':
          productAttributes = {
            brand: getRandomElement(['Apple', 'Samsung', 'Sony', 'LG', 'Lenovo']),
            model: `Model-${Math.floor(Math.random() * 1000)}`,
            weight: `${(Math.random() * 5 + 0.5).toFixed(2)} kg`
          };
          productName = `${productAttributes.brand} ${category} ${productAttributes.model}`;
          break;
        case 'Clothing':
          productAttributes = {
            brand: getRandomElement(['Nike', 'Adidas', 'Gap', 'H&M', 'Zara']),
            size: getRandomElement(productSizes),
            color: getRandomElement(productColors),
            material: getRandomElement(['Cotton', 'Polyester', 'Wool', 'Linen'])
          };
          productName = `${productAttributes.brand} ${getRandomElement(['Shirt', 'Pants', 'Jacket', 'Dress'])}`;
          break;
        case 'Furniture':
          productAttributes = {
            material: getRandomElement(['Wood', 'Metal', 'Glass', 'Plastic']),
            dimensions: `${Math.floor(Math.random() * 100 + 50)}x${Math.floor(Math.random() * 100 + 50)}x${Math.floor(Math.random() * 100 + 30)} cm`,
            weight: `${(Math.random() * 50 + 5).toFixed(2)} kg`,
            color: getRandomElement(productColors)
          };
          productName = `${getRandomElement(['Modern', 'Classic', 'Vintage', 'Rustic'])} ${getRandomElement(['Chair', 'Table', 'Sofa', 'Desk', 'Shelf'])}`;
          break;
        default:
          productAttributes = {
            brand: getRandomElement(['Brand A', 'Brand B', 'Brand C', 'Brand D']),
            color: getRandomElement(productColors),
            weight: `${(Math.random() * 3 + 0.1).toFixed(2)} kg`
          };
          productName = `${productAttributes.brand} ${category} Item`;
      }
      
      // Calculate return processing time in days
      const processingTime = Math.floor((Date.now() - returnDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Determine the disposition based on condition, reason, and category
      let disposition;
      if (condition === 'Excellent' && reason === 'Changed Mind') {
        disposition = 'Resell as New';
      } else if (['Excellent', 'Good'].includes(condition) && !['Defective', 'Damaged in Transit', 'Missing Parts'].includes(reason)) {
        disposition = 'Refurbish';
      } else if (['Fair'].includes(condition) || category === 'Electronics') {
        disposition = 'Discount Sale';
      } else if (condition === 'Poor' || reason === 'Damaged in Transit') {
        disposition = 'Recycle';
      } else {
        disposition = 'Donate';
      }
      
      // Flag suspicious returns based on patterns
      const isSuspicious = 
        (processingTime < 2 && price > 200) || // High-value items returned very quickly
        (reason === 'Defective' && condition === 'Excellent') || // Contradictory reason and condition
        (returnDate - purchaseDate < 1000 * 60 * 60 * 24 && price > 100); // Returned within 24 hours of purchase
      
      items.push({
        id: `RET-${10000 + i}`,
        product: {
          name: productName,
          category,
          price,
          sku: `SKU-${category.substring(0, 3).toUpperCase()}-${10000 + Math.floor(Math.random() * 90000)}`,
          attributes: productAttributes
        },
        transaction: {
          purchaseDate,
          returnDate,
          purchaseOrderNumber: `PO-${20000 + Math.floor(Math.random() * 10000)}`,
          returnAuthorizationNumber: `RA-${30000 + Math.floor(Math.random() * 10000)}`
        },
        customer: {
          id: customer.id,
          name: customer.name,
          contactPerson: customer.contactPerson,
          tier: customer.tier
        },
        return: {
          reason,
          condition,
          comments: reason === 'Other' ? 'Customer provided no additional details' : '',
          attachments: isSuspicious ? ['photo1.jpg', 'receipt.pdf'] : [],
          processingTime,
          disposition
        },
        logistics: {
          fulfillmentCenter: {
            id: fulfillmentCenter.id,
            name: fulfillmentCenter.name,
            location: fulfillmentCenter.location
          },
          handledBy: getRandomElement(employees),
          shippingCost: Math.round(Math.random() * 20) + 5,
          restockingFee: disposition === 'Resell as New' ? 0 : Math.round(price * 0.1)
        },
        metrics: {
          returnRate: (Math.random() * 0.3).toFixed(2),
          customerLifetimeValue: Math.round(Math.random() * 5000) + 500,
          processingCost: Math.round(Math.random() * 50) + 10
        },
        flags: {
          isSuspicious,
          requiresManagerReview: isSuspicious || price > 250,
          highValue: price > 200,
          repeated: Math.random() > 0.9,
          highRiskCustomer: Math.random() > 0.95
        }
      });
    }
    
    return items;
  };
  
  // Generate alerts based on suspicious returns
  const generateAlerts = (returnItems) => {
    return returnItems
      .filter(item => item.flags.isSuspicious)
      .map(item => {
        const alertTypes = [
          'Suspicious Return Pattern',
          'High Value Item',
          'Condition Mismatch',
          'Multiple Returns',
          'Quick Return'
        ];
        
        return {
          id: `ALERT-${Math.floor(Math.random() * 10000)}`,
          date: new Date(),
          type: getRandomElement(alertTypes),
          severity: getRandomElement(['Low', 'Medium', 'High']),
          message: `Suspicious return detected for ${item.product.name} from ${item.customer.name}`,
          relatedReturnId: item.id,
          status: getRandomElement(['New', 'Under Review', 'Resolved', 'Dismissed']),
          assignedTo: getRandomElement(employees)
        };
      });
  };
  
  // Generate summary metrics data
  const generateMetrics = (returnItems) => {
    const totalReturns = returnItems.length;
    const totalValue = returnItems.reduce((sum, item) => sum + item.product.price, 0);
    
    const byCategory = {};
    productCategories.forEach(category => {
      const categoryItems = returnItems.filter(item => item.product.category === category);
      byCategory[category] = {
        count: categoryItems.length,
        percentage: (categoryItems.length / totalReturns * 100).toFixed(1),
        value: categoryItems.reduce((sum, item) => sum + item.product.price, 0)
      };
    });
    
    const byReason = {};
    returnReasons.forEach(reason => {
      const reasonItems = returnItems.filter(item => item.return.reason === reason);
      byReason[reason] = {
        count: reasonItems.length,
        percentage: (reasonItems.length / totalReturns * 100).toFixed(1)
      };
    });
    
    const byDisposition = {};
    const dispositions = ['Resell as New', 'Refurbish', 'Discount Sale', 'Recycle', 'Donate'];
    dispositions.forEach(disposition => {
      const dispositionItems = returnItems.filter(item => item.return.disposition === disposition);
      byDisposition[disposition] = {
        count: dispositionItems.length,
        percentage: (dispositionItems.length / totalReturns * 100).toFixed(1),
        value: dispositionItems.reduce((sum, item) => sum + item.product.price, 0)
      };
    });
    
    const byCenter = {};
    fulfillmentCenters.forEach(center => {
      const centerItems = returnItems.filter(item => item.logistics.fulfillmentCenter.id === center.id);
      byCenter[center.id] = {
        name: center.name,
        location: center.location,
        count: centerItems.length,
        percentage: (centerItems.length / totalReturns * 100).toFixed(1)
      };
    });
    
    const byCustomer = {};
    customers.forEach(customer => {
      const customerItems = returnItems.filter(item => item.customer.id === customer.id);
      byCustomer[customer.id] = {
        name: customer.name,
        count: customerItems.length,
        value: customerItems.reduce((sum, item) => sum + item.product.price, 0)
      };
    });
    
    // Calculate processing times
    const processingTimes = returnItems.map(item => item.return.processingTime);
    const avgProcessingTime = processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
    
    // Generate trend data (last 12 months)
    const trendData = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      
      trendData.unshift({
        month: `${monthName} ${year}`,
        count: Math.floor(Math.random() * 100) + 50,
        value: Math.floor(Math.random() * 20000) + 10000
      });
    }
    
    return {
      summary: {
        totalReturns,
        totalValue,
        averageValue: (totalValue / totalReturns).toFixed(2),
        suspiciousReturnsPercentage: (returnItems.filter(item => item.flags.isSuspicious).length / totalReturns * 100).toFixed(1),
        averageProcessingTime: avgProcessingTime.toFixed(1)
      },
      breakdowns: {
        byCategory,
        byReason,
        byDisposition,
        byCenter,
        byCustomer
      },
      trends: {
        monthly: trendData,
        returnsRate: (Math.random() * 5 + 3).toFixed(1) // percent
      }
    };
  };
  
  // Generate customer feedback data
  const generateFeedback = () => {
    const feedbackTypes = ['Return Process', 'Refund Speed', 'Customer Service', 'Overall Experience'];
    const ratings = [1, 2, 3, 4, 5];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `FB-${1000 + i}`,
      customerId: getRandomElement(customers).id,
      date: generateRandomDate(new Date(2023, 0, 1), new Date(2024, 2, 28)),
      type: getRandomElement(feedbackTypes),
      rating: getRandomElement(ratings),
      comment: getRandomElement([
        'Very satisfied with how my return was handled.',
        'The process took longer than expected.',
        'Customer service was excellent!',
        'I wish the return process was simpler.',
        'Refund was processed quickly, thank you!',
        'Had some issues with the return authorization.',
        '',
        'Will definitely shop again despite needing to return.',
        'Instructions could have been clearer.'
      ])
    }));
  };
  
  // App configuration settings
  const appConfig = {
    dispositionRules: {
      'Resell as New': {
        conditions: ['Excellent'],
        reasons: ['Changed Mind', 'Wrong Size', 'Gift Not Wanted'],
        maxDaysSincePurchase: 30
      },
      'Refurbish': {
        conditions: ['Excellent', 'Good'],
        categories: ['Electronics', 'Furniture'],
        excludeReasons: ['Defective', 'Damaged in Transit']
      },
      'Discount Sale': {
        conditions: ['Good', 'Fair'],
        excludeCategories: ['Beauty']
      },
      'Donate': {
        conditions: ['Fair', 'Poor'],
        categories: ['Clothing', 'Toys', 'Books']
      },
      'Recycle': {
        conditions: ['Poor', 'Damaged'],
        categories: ['Electronics']
      }
    },
    alertThresholds: {
      highValueThreshold: 200,
      quickReturnThreshold: 48, // hours
      suspiciousConditions: [
        { reason: 'Defective', condition: 'Excellent' },
        { reason: 'Damaged in Transit', condition: 'Excellent' }
      ]
    },
    userPreferences: {
      dashboardLayout: {
        topCards: ['totalReturns', 'returnsValue', 'avgProcessingTime', 'suspiciousRate'],
        middleSection: ['categoryBreakdown', 'dispositionBreakdown'],
        bottomSection: ['trendsChart', 'recentAlerts']
      },
      alertsToShow: 5,
      defaultDateRange: 'last30Days',
      refreshInterval: 15, // minutes
      theme: 'light'
    }
  };
  
  // Main mock data object
  const mockData = {
    returnItems: generateReturnItems(150),
    get alerts() {
      return generateAlerts(this.returnItems);
    },
    get metrics() {
      return generateMetrics(this.returnItems);
    },
    feedback: generateFeedback(),
    enterpriseData: {
      fulfillmentCenters,
      customers,
      employees
    },
    appConfig
  };
  
  export default mockData;