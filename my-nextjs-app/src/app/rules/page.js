'use client'

import { useState, useCallback } from 'react'
import { 
  Home,
  Map, 
  FileText, 
  BarChart2,
  Save,
  Play,
  Download,
  Share2
} from 'lucide-react'
import Sidebar from '../../components/sidebar'
import MobileSidebar from '../../components/mobileSidebar'
import Topbar from '../../components/topbar'
import BlockLibrary from '../../components/rules/block-library'
import RuleCanvas from '../../components/rules/rule-canvas'
import RuleSaveModal from '../../components/rules/rule-save-modal'
import { ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'

// Example data
const navigation = [
  { name: 'Returns Dashboard', href: '#', icon: Home, current: false, id: 'dashboard' },
  { name: 'Logistics Map', href: '#', icon: Map, current: false, id: 'map' },
  { name: 'Enterprise Rules', href: '#', icon: FileText, current: true, id: 'rules' },
  { name: 'Return Analytics', href: '#', icon: BarChart2, current: false, id: 'analytics' },
]

const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

export default function EnterpriseRules() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('rules')
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [activeRuleFlow, setActiveRuleFlow] = useState("Return Policy Rule")
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  // Function to create a rule definition object
  const createRuleDefinition = (ruleName) => {
    return {
      id: ruleName.toLowerCase().replace(/\s+/g, '_'),
      name: ruleName,
      createdAt: new Date().toISOString(),
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: { ...node.position },
        data: {
          id: node.data.id,
          title: node.data.title,
          type: node.data.type,
          config: node.data.config || {},
        }
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        sourceHandle: edge.sourceHandle,
        target: edge.target,
        targetHandle: edge.targetHandle,
        label: edge.label
      }))
    };
  };

  // Handle saving the rule flow
  const handleSaveRule = () => {
    if (nodes.length === 0) {
      alert("There's nothing to save. Please create a rule flow first.");
      return;
    }
    
    setIsSaveModalOpen(true)
  }

  // Save rule to localStorage
  const saveRuleToLocalStorage = (ruleName, description = '', isActive = true) => {
    try {
      const ruleDefinition = createRuleDefinition(ruleName);
      
      // Add description and status
      ruleDefinition.description = description;
      ruleDefinition.isActive = isActive;
      
      // Save to localStorage
      const ruleKey = `rule_${ruleDefinition.id}`;
      localStorage.setItem(ruleKey, JSON.stringify(ruleDefinition));
      
      console.log('Rule saved to localStorage:', ruleKey, ruleDefinition);
      
      return true;
    } catch (error) {
      console.error('Error saving rule to localStorage:', error);
      return false;
    }
  };

  // Handle exporting the rule
  const handleExportRule = useCallback(() => {
    if (nodes.length === 0) {
      alert("There's nothing to export. Please create a rule flow first.");
      return;
    }
  
    // Create and export rule definition
    const ruleDefinition = createRuleDefinition(activeRuleFlow);
  
    // Convert to JSON and create a downloadable file
    const jsonString = JSON.stringify(ruleDefinition, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ruleDefinition.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  
    // Show success message
    alert(`Rule "${activeRuleFlow}" has been exported successfully!`);
  }, [nodes, edges, activeRuleFlow]);  // <-- Add nodes and edges as dependencies
  

  // Handle running/testing the rule
  const handleRunRule = useCallback(() => {
    // Check if there's a valid flow
    if (nodes.length === 0) {
      alert("Please add at least one block to test this rule.");
      return;
    }
    
    // Show connected flow or error if no connections
    if (edges.length === 0 && nodes.length > 1) {
      alert("Please connect your blocks to create a complete rule flow.");
      return;
    }
    
    // Demo validation: Make sure we have a path from trigger to action
    const hasTrigger = nodes.some(node => node.type === 'trigger');
    const hasAction = nodes.some(node => node.type === 'action');
    
    if (!hasTrigger) {
      alert("Your rule needs a trigger block to start the flow.");
      return;
    }
    
    if (!hasAction) {
      alert("Your rule needs at least one action block to complete the flow.");
      return;
    }
    
    // Show success message with flow summary
    alert(`
Rule flow test successful!

Flow Summary:
- Total blocks: ${nodes.length}
- Total connections: ${edges.length}
- Trigger blocks: ${nodes.filter(n => n.type === 'trigger').length}
- Condition blocks: ${nodes.filter(n => n.type === 'condition').length}
- Action blocks: ${nodes.filter(n => n.type === 'action').length}

Your return processing rule has been validated and is ready to use.
    `);
  }, [nodes, edges]);

  // Debug function to check localStorage
  const checkLocalStorage = () => {
    const allKeys = Object.keys(localStorage);
    const ruleKeys = allKeys.filter(key => key.startsWith('rule_'));
    
    console.log('Found rule keys:', ruleKeys);
    
    ruleKeys.forEach(key => {
      try {
        const ruleData = JSON.parse(localStorage.getItem(key));
        console.log(`Rule: ${key}`, ruleData);
      } catch (e) {
        console.error(`Error parsing rule ${key}:`, e);
      }
    });
    
    return ruleKeys.length > 0;
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Mobile sidebar */}
        <MobileSidebar 
          navigation={navigation}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeLink={activeLink}
          setActiveLink={setActiveLink}
        />

        {/* Desktop sidebar */}
        <Sidebar 
          navigation={navigation}
          activeLink={activeLink}
          setActiveLink={setActiveLink}
        />

        {/* Main content area */}
        <div className="lg:pl-72 flex flex-1 flex-col overflow-hidden">
          <Topbar 
            setSidebarOpen={setSidebarOpen}
            userNavigation={userNavigation}
          />

          <main className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Rule Builder Header */}
              <div className="px-6 py-4 border-b border-stone-200 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-stone-900">{activeRuleFlow}</h1>
                    <p className="text-sm text-stone-500">Connect blocks to create your return automation flow</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={checkLocalStorage}
                      className="px-4 py-2 flex items-center text-sm font-medium rounded-md border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      Check Saved Rules
                    </button>
                    <button 
                      onClick={handleExportRule}
                      className="px-4 py-2 flex items-center text-sm font-medium rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                    >
                      <Download className="h-4 w-4 mr-1" /> Export
                    </button>
                    <button 
                      onClick={handleRunRule}
                      className="px-4 py-2 flex items-center text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-1" /> Test Flow
                    </button>
                    <button 
                      onClick={handleSaveRule}
                      className="px-4 py-2 flex items-center text-sm font-medium rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                    >
                      <Save className="h-4 w-4 mr-1" /> Save Rule
                    </button>
                  </div>
                </div>
                
                {/* Help text for connecting blocks */}
                <div className="mt-2 bg-blue-50 p-2 rounded text-sm text-blue-700 border border-blue-100">
                  <p><strong>How to use:</strong> Drag blocks from the left panel onto the canvas. Connect blocks by dragging from the handles (circles) on one block to another. Condition blocks have Yes and No outputs to create different paths.</p>
                </div>
              </div>
              
              {/* Rule Builder Workspace */}
              <div className="flex flex-1 overflow-hidden">
                {/* Blocks Library Sidebar */}
                <BlockLibrary 
                  setNodes={setNodes} 
                  nodes={nodes} 
                />
                
                {/* Main Rules Canvas */}
                <RuleCanvas 
                  nodes={nodes} 
                  edges={edges} 
                  setNodes={setNodes} 
                  setEdges={setEdges} 
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Save Modal */}
      {isSaveModalOpen && (
        <RuleSaveModal 
          isOpen={isSaveModalOpen} 
          setIsOpen={setIsSaveModalOpen} 
          ruleName={activeRuleFlow}
          setRuleName={setActiveRuleFlow}
          onSave={(name, description, isActive) => {
            const success = saveRuleToLocalStorage(name, description, isActive);
            if (success) {
              setActiveRuleFlow(name);
              alert(`Rule "${name}" saved successfully!`);
            } else {
              alert('Error saving rule. Please try again.');
            }
            setIsSaveModalOpen(false);
          }}
        />
      )}
    </ReactFlowProvider>
  );
}