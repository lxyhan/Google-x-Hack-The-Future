// app/services/ecommerce-notification-service.js

import { generateListingWithGemini } from '../api/gemini/listing-generator';

/**
 * Notifies the ecommerce frontend about items ready for resale or refurbishment
 * @param {Array} processedReturns - The returns that have been processed
 * @returns {Promise<Array>} The items with generated listings
 */
export async function notifyEcommerceForResale(processedReturns) {
  // Filter returns that are marked for resale or refurbishment
  const resaleItems = processedReturns.filter(returnItem => 
    returnItem.nextAction === 'Resale' || returnItem.nextAction === 'Refurbishment'
  );
  
  // Generate listings for each item using Gemini API
  const itemsWithListings = await Promise.all(resaleItems.map(async (returnItem) => {
    // Map return items to a format for listing generation
    const itemsToList = returnItem.items.map(item => {
      return {
        id: item.id,
        returnId: returnItem.id,
        name: item.name,
        category: item.category,
        condition: item.condition,
        originalPrice: item.price,
        recommendedPrice: calculateRecommendedPrice(item.price, item.condition),
        qualityAssessment: returnItem.qualityAssessment || {
          overallQuality: 'good',
          damageLevel: 'minimal',
          wearLevel: 'light',
          functionalIssues: 'none'
        },
        reasonReturned: item.reason,
        originalPackaging: returnItem.originalPackaging,
        images: item.images || [],
        videoAnalysis: item.videoAnalysis || null,
        nextAction: returnItem.nextAction
      };
    });
    
    // For each item in the return, generate a listing using Gemini API
    const enrichedItems = await Promise.all(itemsToList.map(async (item) => {
      try {
        // Generate a listing description using Gemini API
        const listing = await generateListingWithGemini({
          itemName: item.name,
          category: item.category,
          condition: item.condition,
          qualityAssessment: item.qualityAssessment,
          reasonReturned: item.reasonReturned,
          originalPackaging: item.originalPackaging,
          nextAction: item.nextAction
        });
        
        return {
          ...item,
          generatedListing: listing
        };
      } catch (error) {
        console.error(`Error generating listing for item ${item.id}:`, error);
        return {
          ...item,
          generatedListing: {
            title: `${item.name} - ${item.condition}`,
            description: `${item.name} in ${item.condition} condition. Previously returned item now available at a discounted price.`,
            tags: [item.category, item.condition.toLowerCase(), 'returned item']
          }
        };
      }
    }));
    
    return {
      ...returnItem,
      enrichedItems
    };
  }));
  
  // Return the processed items with their generated listings
  return itemsWithListings;
}

/**
 * Helper function to calculate the recommended resale price based on condition
 * @param {number} originalPrice - The original price of the item
 * @param {string} condition - The condition of the item
 * @returns {number} The recommended resale price
 */
function calculateRecommendedPrice(originalPrice, condition) {
  const conditionDiscounts = {
    'New with tags': 0.9,
    'Like new': 0.8,
    'Good': 0.7,
    'Fair': 0.6,
    'Poor': 0.5
  };
  
  // Default to 70% if condition not recognized
  const discountFactor = conditionDiscounts[condition] || 0.7;
  
  return Math.round(originalPrice * discountFactor * 100) / 100;
}

/**
 * Updates the ecommerce frontend state with resale items
 * @param {Array} itemsWithListings - The items with generated listings
 * @returns {Promise<Object>} Status of the update
 */
export async function updateEcommerceFrontend(itemsWithListings) {
  // In a real implementation, this might involve:
  // 1. Calling a Next.js API route
  // 2. Using a state management solution like Redux or Context API
  // 3. Pushing to a message queue or webhook
  
  try {
    // Extract all enriched items from all returns
    const allItems = itemsWithListings.flatMap(returnItem => 
      returnItem.enrichedItems.map(item => ({
        ...item,
        customerName: returnItem.customerName,
        customerId: returnItem.customerId,
        returnDate: returnItem.dateReturned
      }))
    );
    
    // This would be a call to your Next.js API to update frontend state
    // For now, we'll just simulate a successful response
    console.log(`Notified ecommerce frontend about ${allItems.length} items ready for resale`);
    
    return {
      success: true,
      itemsCount: allItems.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating ecommerce frontend:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Example usage:
 * 
 * // Process returns
 * const { processedReturns } = await processReturnsWithRule(myRuleDefinition);
 * 
 * // Notify ecommerce system about items for resale
 * const itemsWithListings = await notifyEcommerceForResale(processedReturns);
 * 
 * // Update frontend state
 * await updateEcommerceFrontend(itemsWithListings);
 */