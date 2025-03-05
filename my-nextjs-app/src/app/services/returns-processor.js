// app/services/returns-processor.js

import { executeRule } from './rule-execution-engine';
import { getRecentReturns, getReturnStatistics } from '../api/returns/data';

/**
 * Processes all returns through the rule engine and generates updated statistics
 * @param {Object} ruleDefinition - The exported rule definition JSON
 * @returns {Object} Updated statistics and categorized returns
 */
export async function processReturnsWithRule(ruleDefinition) {
  // Get all recent returns
  const returns = await getRecentReturns();
  const baseStatistics = await getReturnStatistics();
  
  // Process each return through the rule engine
  const processedReturns = returns.map(returnItem => {
    // Format the return data in the structure expected by the rule engine
    const returnData = {
      id: returnItem.id,
      customerId: returnItem.customerId,
      customerName: returnItem.customerName,
      returnFrequency: returnItem.returnFrequency || 'Normal',
      purchaseDate: returnItem.datePurchased,
      returnDate: returnItem.dateReturned,
      itemCondition: returnItem.items[0].condition?.toLowerCase().includes('new') ? 'unused' : 'used',
      originalPackaging: returnItem.items[0].condition?.toLowerCase().includes('tag') ? true : false,
      reason: returnItem.items[0].reason,
      reasonDetails: returnItem.items[0].reasonDetails,
      customerReturnsCount: returnItem.returnFrequency === 'High' ? 6 : 2, // Example logic
      orderValue: returnItem.items.reduce((total, item) => total + (item.price * item.quantity), 0),
      itemsCount: returnItem.items.length,
      categories: [...new Set(returnItem.items.map(item => item.category))]
    };
    
    // Execute the rule on this return
    try {
      const result = executeRule(ruleDefinition, returnData);
      
      // Combine original return data with rule processing result
      return {
        ...returnItem,
        ruleProcessingResult: result.result,
        executionPath: result.executionPath,
        autoProcessed: result.isComplete,
        // Update the return status and next actions based on rule result
        status: mapRuleResultToStatus(result.result, returnItem.status),
        nextAction: mapRuleResultToNextAction(result.result, returnItem.nextAction)
      };
    } catch (error) {
      console.error(`Error processing return ${returnItem.id}:`, error);
      return {
        ...returnItem,
        ruleProcessingResult: 'ERROR',
        executionPath: [],
        autoProcessed: false
      };
    }
  });
  
  // Generate updated statistics based on rule processing
  const updatedStatistics = generateUpdatedStatistics(baseStatistics, processedReturns);
  
  return {
    processedReturns,
    statistics: updatedStatistics,
    insights: generateInsightsFromProcessing(processedReturns, updatedStatistics)
  };
}

/**
 * Maps a rule result to a return status
 */
function mapRuleResultToStatus(ruleResult, currentStatus) {
  switch (ruleResult) {
    case 'APPROVED':
      return 'Processed';
    case 'REJECTED':
      return 'Rejected';
    case 'MANUAL_REVIEW':
      return 'Under Review';
    default:
      return currentStatus;
  }
}

/**
 * Maps a rule result to a next action
 */
function mapRuleResultToNextAction(ruleResult, currentNextAction) {
  if (ruleResult.startsWith('OUTCOME_')) {
    return ruleResult.replace('OUTCOME_', '');
  }
  
  switch (ruleResult) {
    case 'APPROVED':
      return 'Refund Process';
    case 'REJECTED':
      return 'Return to Customer';
    case 'MANUAL_REVIEW':
      return 'Quality Assessment';
    default:
      return currentNextAction;
  }
}

/**
 * Generates updated statistics based on rule processing results
 */
function generateUpdatedStatistics(baseStatistics, processedReturns) {
  // Clone the base statistics
  const statistics = JSON.parse(JSON.stringify(baseStatistics));
  
  // Update the statistics based on rule processing
  statistics.overall.approved = processedReturns.filter(r => 
    r.ruleProcessingResult === 'APPROVED' || r.status === 'Processed'
  ).length;
  
  statistics.overall.denied = processedReturns.filter(r => 
    r.ruleProcessingResult === 'REJECTED' || r.status === 'Rejected'
  ).length;
  
  statistics.overall.pending = processedReturns.filter(r => 
    r.ruleProcessingResult === 'MANUAL_REVIEW' || r.status === 'Under Review' || r.status === 'In Process'
  ).length;
  
  // Calculate the fraud suspected value
  statistics.overall.fraudSuspected = processedReturns.filter(r => 
    r.flag === 'Frequent returner' || r.returnFrequency === 'High' || (r.riskScore && r.riskScore > 50)
  ).length;
  
  // Update by processing status
  statistics.byProcessingStatus = [
    {
      status: "Refunded",
      count: processedReturns.filter(r => r.ruleProcessingResult === 'APPROVED' || r.status === 'Processed').length,
      percentage: Math.round((processedReturns.filter(r => r.ruleProcessingResult === 'APPROVED' || r.status === 'Processed').length / processedReturns.length) * 100)
    },
    {
      status: "Resale",
      count: processedReturns.filter(r => r.nextAction === 'Resale').length,
      percentage: Math.round((processedReturns.filter(r => r.nextAction === 'Resale').length / processedReturns.length) * 100)
    },
    {
      status: "Refurbishment",
      count: processedReturns.filter(r => r.nextAction === 'Refurbishment').length,
      percentage: Math.round((processedReturns.filter(r => r.nextAction === 'Refurbishment').length / processedReturns.length) * 100)
    },
    {
      status: "Damaged/Write-off",
      count: processedReturns.filter(r => r.nextAction === 'Quality Assessment').length,
      percentage: Math.round((processedReturns.filter(r => r.nextAction === 'Quality Assessment').length / processedReturns.length) * 100)
    }
  ];
  
  // Calculate auto-processing effectiveness
  const automaticallyProcessed = processedReturns.filter(r => r.autoProcessed).length;
  statistics.automationMetrics = {
    automaticallyProcessed,
    automationRate: Math.round((automaticallyProcessed / processedReturns.length) * 100),
    manualReviewRate: Math.round((processedReturns.filter(r => r.ruleProcessingResult === 'MANUAL_REVIEW').length / processedReturns.length) * 100),
    averagePathLength: Math.round(processedReturns.reduce((sum, r) => sum + (r.executionPath?.length || 0), 0) / processedReturns.length)
  };
  
  return statistics;
}

/**
 * Generates insights based on rule processing
 */
function generateInsightsFromProcessing(processedReturns, statistics) {
  const insights = [];
  
  // Check for high automation opportunities
  if (statistics.automationMetrics.automationRate < 70) {
    insights.push({
      type: "trend",
      title: "Automation Opportunity",
      description: `Current automation rate is ${statistics.automationMetrics.automationRate}%. Consider additional rule refinements.`,
      recommendations: [
        "Add more condition blocks to your rule flow",
        "Refine existing conditions to be more specific",
        "Create separate rules for different product categories"
      ],
      priority: "Medium",
      potentialImpact: "Reduced processing costs"
    });
  }
  
  // Check for high manual review rate
  if (statistics.automationMetrics.manualReviewRate > 30) {
    insights.push({
      type: "inventory",
      title: "High Manual Review Rate",
      description: `${statistics.automationMetrics.manualReviewRate}% of returns are being sent for manual review. This increases processing time.`,
      recommendations: [
        "Refine rule conditions to reduce manual reviews",
        "Add more specific rules for common return scenarios"
      ],
      priority: "High",
      potentialImpact: "Faster processing, improved customer satisfaction"
    });
  }
  
  // Check for return reasons that might need attention
  const reasonCounts = {};
  processedReturns.forEach(r => {
    const reason = r.items[0].reason;
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });
  
  const topReason = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0];
  if (topReason && topReason[1] > processedReturns.length * 0.3) {
    insights.push({
      type: "customer",
      title: `High Return Rate: "${topReason[0]}"`,
      description: `${Math.round((topReason[1] / processedReturns.length) * 100)}% of returns cite "${topReason[0]}" as the reason.`,
      recommendations: [
        "Review product descriptions and sizing information",
        "Consider adjusting product design or features",
        "Add more detailed product information to reduce expectation mismatch"
      ],
      priority: "High",
      potentialImpact: "Reduced return rate, increased customer satisfaction"
    });
  }
  
  // If there are many frequent returners, add an insight
  const frequentReturners = processedReturns.filter(r => r.returnFrequency === 'High' || r.flag === 'Frequent returner').length;
  if (frequentReturners > processedReturns.length * 0.15) {
    insights.push({
      type: "fraud",
      title: "High Rate of Frequent Returners",
      description: `${Math.round((frequentReturners / processedReturns.length) * 100)}% of returns are from frequent returners.`,
      recommendations: [
        "Review current return policy limits",
        "Consider implementing a return fee for excessive returns",
        "Create special rules for handling frequent returners"
      ],
      priority: "Medium",
      potentialImpact: "Reduced return abuse, better profit margins"
    });
  }
  
  return insights;
}

/**
 * Example usage:
 * 
 * // Load your exported rule definition JSON
 * import myRuleDefinition from './my_return_policy_rule.json';
 * 
 * // Process all returns using this rule
 * const { processedReturns, statistics, insights } = await processReturnsWithRule(myRuleDefinition);
 * 
 * // Now you can update your dashboard with this data
 * updateDashboard(processedReturns, statistics, insights);
 */