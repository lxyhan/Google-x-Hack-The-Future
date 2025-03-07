'use client'

import { useState } from 'react'
import { 
  Home,
  Map, 
  FileText, 
  BarChart2
} from 'lucide-react'
import Sidebar from '../../components/sidebar'
import MobileSidebar from '../../components/mobileSidebar'
import Topbar from '../../components/topbar'
const navigation = [
  { name: 'Returns Dashboard', href: '#', icon: Home, current: false, id: 'dashboard' },
  { name: 'Logistics Map', href: '#', icon: Map, current: false, id: 'map' },
  { name: 'Enterprise Rules', href: '#', icon: FileText, current: false, id: 'rules' },
  { name: 'Return Analytics', href: '#', icon: BarChart2, current: true, id: 'analytics' },
]

const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

export default function ReturnAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('analytics')

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

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Analytics-specific content */}
              <div className="p-4">
                <h1 className="text-2xl font-bold">Return Analytics Content</h1>
                <p className="mt-4 text-stone-600">This is where the return analytics content will be displayed.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}