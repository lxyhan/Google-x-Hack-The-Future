'use client'

import { useState } from 'react'
import { 
  Package, 
  AlertTriangle, 
  GitBranch, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  ChevronDown,
  ChevronUp
} from 'lucide-react'

// Block type definitions
const BLOCK_TYPES = {
  TRIGGER: 'trigger',
  CONDITION: 'condition',
  ACTION: 'action'
};

// Simplified block templates (5-10 essential blocks)
const blockTemplates = {
  // Trigger blocks (start points)
  [BLOCK_TYPES.TRIGGER]: [
    { 
      id: 'trigger_submit', 
      type: BLOCK_TYPES.TRIGGER, 
      title: 'Return Request Submitted',
      description: 'Starts the workflow when a customer submits a return request',
      icon: Package,
      iconName: 'Package',
      color: 'bg-blue-100 border-blue-300 text-blue-800',
      iconBg: 'bg-blue-200',
      configurable: false
    }
  ],
  
  // Condition blocks (decision points)
  [BLOCK_TYPES.CONDITION]: [
    { 
      id: 'condition_days', 
      type: BLOCK_TYPES.CONDITION, 
      title: 'Purchased Within X Days?',
      description: 'Checks if the purchase was within the return policy timeframe',
      icon: GitBranch,
      iconName: 'GitBranch',
      color: 'bg-amber-100 border-amber-300 text-amber-800',
      iconBg: 'bg-amber-200',
      configurable: true,
      config: { days: 30 },
      outputs: ['Yes', 'No']
    },
    { 
      id: 'condition_unused', 
      type: BLOCK_TYPES.CONDITION, 
      title: 'Item Is Unused?',
      description: 'Checks if the returned item is in unused condition',
      icon: GitBranch,
      iconName: 'GitBranch',
      color: 'bg-amber-100 border-amber-300 text-amber-800',
      iconBg: 'bg-amber-200',
      configurable: true,
      config: { option: 'Yes' },
      outputs: ['Yes', 'No']
    }
  ],
  
  // Action blocks (end points)
  [BLOCK_TYPES.ACTION]: [
    { 
      id: 'action_approve', 
      type: BLOCK_TYPES.ACTION, 
      title: 'Auto-Approve Return',
      description: 'Automatically approve the return and issue refund',
      icon: CheckCircle2,
      iconName: 'CheckCircle2',
      color: 'bg-green-100 border-green-300 text-green-800',
      iconBg: 'bg-green-200',
      configurable: false
    },
    { 
      id: 'action_reject', 
      type: BLOCK_TYPES.ACTION, 
      title: 'Reject Return',
      description: 'Reject the return request as it does not meet requirements',
      icon: XCircle,
      iconName: 'XCircle',
      color: 'bg-red-100 border-red-300 text-red-800',
      iconBg: 'bg-red-200',
      configurable: false
    },
    { 
      id: 'action_review', 
      type: BLOCK_TYPES.ACTION, 
      title: 'Manual Review',
      description: 'Send for human review by the returns team',
      icon: AlertTriangle,
      iconName: 'AlertTriangle',
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      iconBg: 'bg-purple-200',
      configurable: false
    }
  ]
};

export default function BlockLibrary({ nodes, setNodes }) {
  const [expandedCategories, setExpandedCategories] = useState({
    [BLOCK_TYPES.TRIGGER]: true,
    [BLOCK_TYPES.CONDITION]: true,
    [BLOCK_TYPES.ACTION]: true
  });

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };

  // Handle drag start event
  const onDragStart = (event, template) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Category titles for display
  const categoryTitles = {
    [BLOCK_TYPES.TRIGGER]: "Trigger Blocks",
    [BLOCK_TYPES.CONDITION]: "Condition Blocks",
    [BLOCK_TYPES.ACTION]: "Action Blocks"
  };

  // Category descriptions
  const categoryDescriptions = {
    [BLOCK_TYPES.TRIGGER]: "Start your automation flow",
    [BLOCK_TYPES.CONDITION]: "Add decision points",
    [BLOCK_TYPES.ACTION]: "Define outcomes"
  };

  return (
    <div className="w-80 border-r border-stone-200 bg-white overflow-y-auto">
      <div className="p-4 border-b border-stone-200">
        <h2 className="text-lg font-semibold text-stone-800">Block Library</h2>
        <p className="text-sm text-stone-500">Drag blocks to build your return flow</p>
      </div>

      <div className="p-4">
        {Object.keys(blockTemplates).map((category) => (
          <div key={category} className="mb-6">
            {/* Category header */}
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              <div>
                <h3 className="font-medium text-stone-800">{categoryTitles[category]}</h3>
                <p className="text-xs text-stone-500">{categoryDescriptions[category]}</p>
              </div>
              <button className="p-1 rounded-full hover:bg-stone-100">
                {expandedCategories[category] ? 
                  <ChevronUp className="h-4 w-4 text-stone-500" /> : 
                  <ChevronDown className="h-4 w-4 text-stone-500" />
                }
              </button>
            </div>
            
            {/* Block list */}
            {expandedCategories[category] && (
              <div className="mt-3 space-y-2">
                {blockTemplates[category].map((block) => {
                  const BlockIcon = block.icon;
                  return (
                    <div 
                      key={block.id}
                      className={`p-3 rounded-lg border ${block.color} cursor-grab relative group hover:shadow-sm transition-shadow`}
                      draggable
                      onDragStart={(event) => onDragStart(event, block)}
                    >
                      <div className="flex items-start">
                        <div className={`p-1.5 rounded-md ${block.iconBg} mr-3`}>
                          <BlockIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{block.title}</h4>
                          <p className="text-xs mt-0.5 text-opacity-80 line-clamp-2">{block.description}</p>
                        </div>
                      </div>
                      {block.configurable && (
                        <div className="mt-2 text-xs border-t border-stone-300 border-opacity-30 pt-1">
                          <span className="text-stone-600">Configurable</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}