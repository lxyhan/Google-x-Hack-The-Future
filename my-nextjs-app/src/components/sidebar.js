'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar({ navigation, activeLink, setActiveLink }) {
  const router = useRouter();
  
  // Updated navigation based on active link
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: item.id === activeLink
  }));

  // Handle navigation click
  const handleNavClick = (item) => {
    setActiveLink(item.id);
    
    // Navigate to the appropriate page based on the ID
    switch(item.id) {
      case 'dashboard':
        router.push('/dashboard');
        break;
      case 'map':
        router.push('/map');
        break;
      case 'rules':
        router.push('/rules');
        break;
      case 'analytics':
        router.push('/analytics');
        break;
      default:
        router.push('/');
    }
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col overflow-y-auto border-r border-black-100 bg-stone-50 shadow-sm">
        {/* Logo and title section with nature theme */}
        <div className="bg-stone-100 px-6 py-5 border-b border-black-100">
          <div className="flex items-center gap-x-4">
            <img
              alt="ReturnFlow"
              src="/logo.png"
              className="h-10 w-auto"
            />
            <div>
              <span className="text-2xl font-semibold text-stone-800">Return<span className="text-green-700">Flow</span></span>
            </div>
          </div>
        </div>
            
        {/* Main navigation section */}
        <div className="flex-1 px-6 py-5">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <div className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-3 ml-2">
                  Navigation
                </div>
                <ul role="list" className="-mx-2 space-y-1">
                  {updatedNavigation.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => handleNavClick(item)}
                        className={classNames(
                          item.current
                            ? 'bg-green-50 text-green-800 border-l-4 border-green-700'
                            : 'text-stone-700 hover:bg-stone-100 hover:text-green-700',
                          'group flex w-full gap-x-3 rounded-md p-3 text-sm font-medium transition-all duration-150',
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current ? 'text-green-700' : 'text-stone-400 group-hover:text-green-700',
                            'h-5 w-5 shrink-0',
                          )}
                        />
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer section */}
        <div className="border-t border-black-100 px-6 py-4 bg-stone-100/50">
          <a
            href="#"
            className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-green-700 transition-colors duration-150"
          >
            <Cog6ToothIcon
              className="h-5 w-5 shrink-0 text-stone-500 group-hover:text-green-700"
            />
            Settings
          </a>
        </div>
      </div>
    </div>
  );
}