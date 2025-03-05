'use client'

import { useState, useEffect } from 'react'
import { 
  Home,
  Map, 
  FileText, 
  BarChart2
} from 'lucide-react'
import Sidebar from '../../components/sidebar'
import MobileSidebar from '../../components/mobileSidebar'
import Topbar from '../../components/topbar'

// Import componentized parts
import DashboardStatsSection from '../../components/dashboard/dashboard-stats-section'
import DashboardMiddleSection from '../../components/dashboard/dashboard-middle-section'
import RecentReturnsTable from '../../components/dashboard/recent-returns-table'

// Import the returns processor
import { processReturnsWithRule } from '../services/returns-processor'

const navigation = [
  { name: 'Returns Dashboard', href: '#', icon: Home, current: true, id: 'dashboard' },
  { name: 'Logistics Map', href: '#', icon: Map, current: false, id: 'map' },
  { name: 'Enterprise Rules', href: '#', icon: FileText, current: false, id: 'rules' },
  { name: 'Return Analytics', href: '#', icon: BarChart2, current: false, id: 'analytics' },
]

const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

export default function ReturnsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [recentReturns, setRecentReturns] = useState([]);
  const [insights, setInsights] = useState([]);
  const [activeRule, setActiveRule] = useState(null);
  const [showRuleSelector, setShowRuleSelector] = useState(false);
  const [savedRules, setSavedRules] = useState([]);

  // Add this function to your component
const checkLocalStorage = () => {
  // Get all keys in localStorage
  const allKeys = Object.keys(localStorage);
  
  // Filter keys starting with 'rule_'
  const ruleKeys = allKeys.filter(key => key.startsWith('rule_'));
  
  console.log('Found rule keys:', ruleKeys);
  
  // Log the content of each rule
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

  // Load saved rules from localStorage
  useEffect(() => {
    const loadSavedRules = () => {
      try {
        // Get rule keys from localStorage
        const ruleKeys = Object.keys(localStorage).filter(key => key.startsWith('rule_'));
        
        if (ruleKeys.length > 0) {
          const rules = ruleKeys.map(key => {
            const ruleJson = localStorage.getItem(key);
            try {
              const rule = JSON.parse(ruleJson);
              return {
                id: rule.id,
                name: rule.name,
                createdAt: rule.createdAt,
                definition: rule
              };
            } catch (e) {
              console.error('Error parsing rule:', e);
              return null;
            }
          }).filter(Boolean);
          
          setSavedRules(rules);
          
          // Set the most recently created rule as active by default
          if (rules.length > 0 && !activeRule) {
            const sortedRules = [...rules].sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
            );
            setActiveRule(sortedRules[0]);
          }
        }
      } catch (e) {
        console.error('Error loading saved rules:', e);
      }
    };
    
    loadSavedRules();
  }, [activeRule]);

  // Fetch data and process with active rule
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (activeRule) {
          // Process returns with the active rule
          const { processedReturns, statistics: updatedStats, insights: newInsights } = 
            await processReturnsWithRule(activeRule.definition);
          
          setRecentReturns(processedReturns);
          setStatistics(updatedStats);
          setInsights(newInsights);
        } else {
          // Fallback to fetching standard data if no rule is active
          const statsRes = await fetch('/api/returns?type=statistics');
          const statsData = await statsRes.json();
          setStatistics(statsData);
          
          const returnsRes = await fetch('/api/returns?type=recent');
          const returnsData = await returnsRes.json();
          setRecentReturns(returnsData);
          
          const insightsRes = await fetch('/api/returns?type=insights');
          const insightsData = await insightsRes.json();
          setInsights(insightsData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or processing dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeRule]);

  // Handle rule selection change
  const handleRuleChange = (ruleId) => {
    const selected = savedRules.find(rule => rule.id === ruleId);
    setActiveRule(selected);
    setShowRuleSelector(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <>
      <div>
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
        <div className="lg:pl-72">
          <Topbar 
            setSidebarOpen={setSidebarOpen}
            userNavigation={userNavigation}
          />

          <main className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Company and page heading */}
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-stone-900">Returns Dashboard</h1>
                  <p className="text-sm text-stone-500 mt-1">
                    NorthStyle Apparel • Enterprise • Last updated: {new Date().toLocaleString()}
                  </p>
                </div>
                
                {/* Rule selector dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowRuleSelector(!showRuleSelector)}
                    className="flex items-center px-4 py-2 border border-stone-300 rounded-md bg-white text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    <span className="mr-1">Active Rule:</span> 
                    <span className="font-bold">{activeRule ? activeRule.name : 'Default'}</span>
                    <svg className="ml-2 h-5 w-5 text-stone-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {showRuleSelector && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-stone-200">
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs font-medium text-stone-500 border-b border-stone-200">
                          Select Active Rule
                        </div>
                        {savedRules.length > 0 ? (
                          savedRules.map(rule => (
                            <button
                              key={rule.id}
                              onClick={() => handleRuleChange(rule.id)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                activeRule && activeRule.id === rule.id 
                                  ? 'bg-green-50 text-green-700' 
                                  : 'text-stone-700 hover:bg-stone-50'
                              }`}
                            >
                              {rule.name}
                              <span className="block text-xs text-stone-500">
                                Created: {new Date(rule.createdAt).toLocaleDateString()}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-stone-500">
                            No saved rules found. Create one in the Enterprise Rules section.
                          </div>
                        )}
                        <div className="border-t border-stone-200 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setActiveRule(null);
                              setShowRuleSelector(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          >
                            Use Default Processing
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Rule application notice */}
              {activeRule && (
                <div className="mb-4 bg-blue-50 p-3 rounded-md border border-blue-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-blue-700">
                        <span className="font-bold">{activeRule.name}</span> rule is currently being applied to all returns. 
                        This affects processing status, statistics, and insights.
                      </p>
                      <p className="mt-3 text-sm md:mt-0 md:ml-6">
                        <a href="/rules" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                          Edit Rule <span aria-hidden="true">&rarr;</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-stone-500">Loading dashboard data...</p>
                </div>
              ) : (
                <>
                  {/* Key statistics section */}
                  <DashboardStatsSection statistics={statistics} />
                  
                  {/* Automation metrics when rule is active */}
                  {activeRule && statistics?.automationMetrics && (
                    <div className="mb-6 bg-white p-4 shadow rounded-lg border border-stone-200">
                      <h2 className="text-lg font-medium text-stone-800 mb-4">Rule Automation Metrics</h2>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-600 font-medium">Auto-Processed</p>
                          <p className="text-2xl font-bold text-green-700">
                            {statistics.automationMetrics.automationRate}%
                          </p>
                          <p className="text-xs text-green-600">
                            {statistics.automationMetrics.automaticallyProcessed} returns
                          </p>
                        </div>
                        
                        <div className="p-3 bg-amber-50 rounded-lg">
                          <p className="text-sm text-amber-600 font-medium">Manual Review</p>
                          <p className="text-2xl font-bold text-amber-700">
                            {statistics.automationMetrics.manualReviewRate}%
                          </p>
                          <p className="text-xs text-amber-600">
                            Requires human attention
                          </p>
                        </div>
                        
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-600 font-medium">Avg Decision Path</p>
                          <p className="text-2xl font-bold text-blue-700">
                            {statistics.automationMetrics.averagePathLength} steps
                          </p>
                          <p className="text-xs text-blue-600">
                            Rule execution complexity
                          </p>
                        </div>
                        
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-600 font-medium">Rule Efficiency</p>
                          <p className="text-2xl font-bold text-purple-700">
                            {100 - statistics.automationMetrics.manualReviewRate}%
                          </p>
                          <p className="text-xs text-purple-600">
                            Higher is better
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Middle section: Return reasons chart and insights */}
                  <DashboardMiddleSection 
                    statistics={statistics} 
                    insights={insights} 
                  />
                  
                  {/* Recent returns table */}
                  <RecentReturnsTable 
                    returns={recentReturns} 
                    totalReturns={statistics?.overall.total}
                    formatDate={formatDate}
                    showRuleOutcome={!!activeRule}
                  />
<button 
  onClick={checkLocalStorage}
  className="px-4 py-2 bg-blue-600 text-white rounded-md"
>
  Check LocalStorage
</button>
                </>
                
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}