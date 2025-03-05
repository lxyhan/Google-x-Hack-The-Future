'use client'

import { useState, useRef, useCallback } from 'react'
import { 
  Home,
  Map, 
  FileText, 
  BarChart2,
  Plus,
  Save,
  Trash2,
  Play,
  ArrowRight,
  GitBranch,
  AlertTriangle,
  Package
} from 'lucide-react'
import Sidebar from '../../components/sidebar'
import MobileSidebar from '../../components/mobileSidebar'
import Topbar from '../../components/topbar'
import BlockLibrary from '../../components/rules/block-library'
import RuleCanvas from '../../components/rules/rule-canvas'
import RuleToolbar from '../../components/rules/rule-toolbar'
import RuleSaveModal from '../../components/rules/rule-save-modal'

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
  const [activeRuleFlow, setActiveRuleFlow] = useState("New Rule Flow")
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  // Handle saving the rule flow
  const handleSaveRule = () => {
    setIsSaveModalOpen(true)
  }

  // Handle running/testing the rule
  const handleRunRule = () => {
    // Logic to simulate the rule execution
    alert("Running rule simulation...")
  }

  return (
    <>
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
                    <p className="text-sm text-stone-500">Build automation rules for your return processing</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleRunRule}
                      className="px-4 py-2 flex items-center text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-1" /> Test Run
                    </button>
                    <button 
                      onClick={handleSaveRule}
                      className="px-4 py-2 flex items-center text-sm font-medium rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                    >
                      <Save className="h-4 w-4 mr-1" /> Save Rule
                    </button>
                  </div>
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
        />
      )}
    </>
  )
}