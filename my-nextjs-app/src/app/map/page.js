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
import LogisticsMapContent from '../../components/MapComponenets/logisticsmapcontent'

const navigation = [
  { name: 'Returns Dashboard', href: '#', icon: Home, current: false, id: 'dashboard' },
  { name: 'Logistics Map', href: '#', icon: Map, current: true, id: 'map' },
  { name: 'Enterprise Rules', href: '#', icon: FileText, current: false, id: 'rules' },
  { name: 'Return Analytics', href: '#', icon: BarChart2, current: false, id: 'analytics' },
]

const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

export default function LogisticsMap() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('map')

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
              {/* Map content component */}
              <LogisticsMapContent />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}