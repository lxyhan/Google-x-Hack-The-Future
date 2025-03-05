import {
    Bars3Icon,
    BellIcon,
  } from '@heroicons/react/24/outline';
  import { 
    ChevronDownIcon, 
    MagnifyingGlassIcon 
  } from '@heroicons/react/20/solid';
  import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
  } from '@headlessui/react';
  
  export default function Topbar({ setSidebarOpen, userNavigation }) {
    return (
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" />
        </button>
  
        {/* Separator */}
        <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />
  
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form action="#" method="GET" className="grid flex-1 grid-cols-1">
            <input
              name="search"
              type="search"
              placeholder="Search"
              aria-label="Search"
              className="col-start-1 row-start-1 block h-full w-full bg-white pl-8 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm"
            />
            <MagnifyingGlassIcon
              className="pointer-events-none col-start-1 row-start-1 h-5 w-5 self-center text-gray-400"
            />
          </form>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
            </button>
  
            {/* Separator */}
            <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
  
            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src="/pfp.png"
                  className="h-8 w-8 rounded-full bg-gray-50"
                />
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-4 text-sm font-semibold text-gray-900">
                    James Han
                  </span>
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
                </span>
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {userNavigation.map((item) => (
                  <MenuItem key={item.name}>
                    <a
                      href={item.href}
                      className="block px-3 py-1 text-sm text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                    >
                      {item.name}
                    </a>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    );
  }