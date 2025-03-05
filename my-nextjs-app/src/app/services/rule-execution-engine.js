/**
 * Rule Execution Engine
 * This module allows you to execute the exported rule flows against return data
 */

/**
 * Executes a rule flow against a return request
 * @param {Object} ruleDefinition - The exported rule definition JSON
 * @param {Object} returnData - The return request data to process
 * @returns {Object} The processing result with decision path and outcome
 */
export const executeRule = (ruleDefinition, returnData) => {
  // Validate the rule definition
  if (!ruleDefinition || !ruleDefinition.nodes || !ruleDefinition.edges) {
    throw new Error('Invalid rule definition');
  }
  
  // Track the execution path
  const executionPath = [];
  
  // Find the starting trigger node
  const triggerNode = ruleDefinition.nodes.find(node => node.type === 'trigger');
  if (!triggerNode) {
    throw new Error('Rule flow must have a trigger node');
  }
  
  // Start execution from the trigger node
  let currentNodeId = triggerNode.id;
  let result = null;
  let isComplete = false;
  
  // Execute until we reach an action node or cannot proceed further
  while (currentNodeId && !isComplete) {
    // Get the current node
    const currentNode = ruleDefinition.nodes.find(node => node.id === currentNodeId);
    if (!currentNode) break;
    
    // Add to execution path
    executionPath.push({
      id: currentNode.id,
      type: currentNode.type,
      title: currentNode.data.title
    });
    
    // Handle node based on type
    switch (currentNode.type) {
      case 'trigger':
        // For trigger nodes, simply move to the next connected node
        const triggerOutEdge = ruleDefinition.edges.find(edge => 
          edge.source === currentNodeId && edge.sourceHandle === 'output'
        );
        currentNodeId = triggerOutEdge ? triggerOutEdge.target : null;
        break;
        
      case 'condition':
        // For condition nodes, evaluate the condition and follow the appropriate path
        const conditionResult = evaluateCondition(currentNode, returnData);
        executionPath[executionPath.length - 1].result = conditionResult ? 'Yes' : 'No';
        
        // Find the matching edge based on condition result
        const conditionOutEdge = ruleDefinition.edges.find(edge => 
          edge.source === currentNodeId && 
          edge.sourceHandle === (conditionResult ? 'yes' : 'no')
        );
        currentNodeId = conditionOutEdge ? conditionOutEdge.target : null;
        break;
        
      case 'action':
        // For action nodes, execute the action and complete the flow
        result = executeAction(currentNode, returnData);
        executionPath[executionPath.length - 1].result = result;
        isComplete = true;
        break;
        
      default:
        throw new Error(`Unknown node type: ${currentNode.type}`);
    }
  }
  
  return {
    returnId: returnData.id,
    result: result,
    isComplete: isComplete,
    executionPath: executionPath
  };
};

/**
 * Evaluates a condition node against return data
 * @param {Object} conditionNode - The condition node to evaluate
 * @param {Object} returnData - The return request data
 * @returns {boolean} The condition result (true/false)
 */
const evaluateCondition = (conditionNode, returnData) => {
  const conditionId = conditionNode.data.id;
  
  // Purchased within X days
  if (conditionId.includes('condition_days')) {
    const days = conditionNode.data.config?.days || 30;
    const purchaseDate = new Date(returnData.purchaseDate);
    const returnDate = new Date(returnData.returnDate);
    const daysDifference = Math.floor((returnDate - purchaseDate) / (1000 * 60 * 60 * 24));
    return daysDifference <= days;
  }
  
  // Item is unused
  if (conditionId.includes('condition_unused')) {
    return returnData.itemCondition === 'unused';
  }
  
  // Original packaging included
  if (conditionId.includes('condition_packaging')) {
    return returnData.originalPackaging === true;
  }
  
  // Customer has returned excessively
  if (conditionId.includes('condition_excessive')) {
    const threshold = parseInt(conditionNode.data.config?.threshold) || 3;
    return returnData.customerReturnsCount > threshold;
  }
  
  // Default to true if condition not recognized
  console.warn(`Unknown condition type: ${conditionId}`);
  return true;
};

/**
 * Executes an action node
 * @param {Object} actionNode - The action node to execute
 * @param {Object} returnData - The return request data
 * @returns {string} The action result
 */
const executeAction = (actionNode, returnData) => {
  const actionId = actionNode.data.id;
  
  // Auto-approve return
  if (actionId.includes('action_approve')) {
    return 'APPROVED';
  }
  
  // Reject return
  if (actionId.includes('action_reject')) {
    return 'REJECTED';
  }
  
  // Manual review
  if (actionId.includes('action_review')) {
    return 'MANUAL_REVIEW';
  }
  
  // Send notification
  if (actionId.includes('action_notify')) {
    return 'NOTIFICATION_SENT';
  }
  
  // Assign outcome
  if (actionId.includes('action_outcome')) {
    return `OUTCOME_${actionNode.data.config?.outcome || 'RESTOCK'}`;
  }
  
  // Send email
  if (actionId.includes('action_email')) {
    return `EMAIL_${actionNode.data.config?.template || 'APPROVED'}`;
  }
  
  // Default action result
  return 'ACTION_EXECUTED';
};

/**
 * Example usage:
 * 
 * // Load your exported rule definition JSON
 * import myRuleDefinition from './my_return_policy_rule.json';
 * 
 * // Sample return request data
 * const returnRequest = {
 *   id: 'RTN-12345',
 *   customerId: 'CUST-789',
 *   purchaseDate: '2023-01-15T12:00:00Z',
 *   returnDate: '2023-01-25T14:30:00Z',
 *   itemCondition: 'unused',
 *   originalPackaging: true,
 *   reason: 'Wrong size',
 *   customerReturnsCount: 2
 * };
 * 
 * // Execute the rule against the return request
 * const result = executeRule(myRuleDefinition, returnRequest);
 * 
 * // Result contains the outcome and execution path
 * console.log(`Return ${result.returnId} processed: ${result.result}`);
 * console.log('Execution path:', result.executionPath);
 */