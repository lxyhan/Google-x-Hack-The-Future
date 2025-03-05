'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function MobileSidebar({ navigation, sidebarOpen, setSidebarOpen, activeLink, setActiveLink }) {
  const router = useRouter();
  
  // Updated navigation based on active link
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: item.id === activeLink
  }));

  // Handle navigation click
  const handleNavClick = (item) => {
    setActiveLink(item.id);
    setSidebarOpen(false); // Close the mobile sidebar after selection
    
    // Navigate to the appropriate page based on the ID
    switch(item.id) {
      case 'dashboard':
        router.push('/');
        break;
      case 'map':
        router.push('/logistics-map');
        break;
      case 'rules':
        router.push('/enterprise-rules');
        break;
      case 'analytics':
        router.push('/return-analytics');
        break;
      default:
        router.push('/');
    }
  };

  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              
              {/* Sidebar component for mobile */}
              <div className="flex grow flex-col overflow-y-auto bg-stone-50 pb-2">
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
                <div className="border-t border-black-100 px-6 py-4 bg-stone-100/50 mt-auto">
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}