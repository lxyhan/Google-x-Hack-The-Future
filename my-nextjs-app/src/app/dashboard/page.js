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

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch statistics
        const statsRes = await fetch('/api/returns?type=statistics');
        const statsData = await statsRes.json();
        setStatistics(statsData);
        
        // Fetch recent returns
        const returnsRes = await fetch('/api/returns?type=recent');
        const returnsData = await returnsRes.json();
        setRecentReturns(returnsData);
        
        // Fetch insights
        const insightsRes = await fetch('/api/returns?type=insights');
        const insightsData = await insightsRes.json();
        setInsights(insightsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-stone-900">Returns Dashboard</h1>
                <p className="text-sm text-stone-500 mt-1">
                  NorthStyle Apparel • Enterprise • Last updated: {new Date().toLocaleString()}
                </p>
              </div>
              
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-stone-500">Loading dashboard data...</p>
                </div>
              ) : (
                <>
                  {/* Key statistics section */}
                  <DashboardStatsSection statistics={statistics} />
                  
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
                  />
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}