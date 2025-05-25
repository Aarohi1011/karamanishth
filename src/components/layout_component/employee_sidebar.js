'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  MdOutlineSpaceDashboard,
  MdQrCodeScanner,
  MdHistory,
  MdExitToApp,
  MdChevronLeft,
  MdChevronRight,
  MdMenu,
  MdClose
} from "react-icons/md";
import Link from 'next/link';

export default function Employee_Sidebar({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  handleLogout,
  isDesktopSidebarCollapsed,
  toggleDesktopSidebar
}) {
  const pathname = usePathname();
  const [isHovering, setIsHovering] = useState(false);

  const isActive = (paths) => {
    return paths.includes(pathname) ? 'bg-[#1e3a8a] text-white shadow-md' : '';
  };

  const handleLinkClick = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    setIsMobileSidebarOpen(false);
  };

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileSidebarOpen && !event.target.closest('.mobile-sidebar')) {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileSidebarOpen]);

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-lg bg-[#4080bf] text-white shadow-md hover:bg-[#1e3a8a] transition-colors"
        >
          {isMobileSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block bg-gradient-to-b from-[#4080bf] to-[#6699cc] text-white flex-col h-screen shadow-lg transition-all duration-300 ease-in-out fixed
          ${isDesktopSidebarCollapsed ? 'w-20' : 'w-72'} 
          ${isHovering && isDesktopSidebarCollapsed ? 'w-72' : ''}`}
       
      >
        {/* Collapse/Expand Button */}
        <div className="flex justify-end p-3">
          <button
            onClick={toggleDesktopSidebar}
            className="p-1 rounded-full hover:bg-[#1e3a8a] transition-colors duration-200 flex items-center justify-center"
            aria-label={isDesktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isDesktopSidebarCollapsed ? 
              <MdChevronRight size={22} className="text-white" /> : 
              <MdChevronLeft size={22} className="text-white" />
            }
          </button>
        </div>

        {/* Logo/Title */}
        <Link
          href="/employee"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 text-xl font-bold justify-center py-4 mx-2 rounded-lg transition duration-200 ease-in-out hover:bg-[#1e3a8a]
            ${(isDesktopSidebarCollapsed && !isHovering) ? 'px-2 justify-center' : 'px-4'}`}
        >
          {(isDesktopSidebarCollapsed && !isHovering) ? (
            <span className="text-white text-2xl font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-user-icon lucide-shield-user">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
            <path d="M6.376 18.91a6 6 0 0 1 11.249.003"/>
            <circle cx="12" cy="11" r="4"/>
        </svg>
              </span>
          ) : (
            <span className="text-white">Employee</span>
          )}
        </Link>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto pb-4">
          <style jsx>{`
            .overflow-y-auto {
              scrollbar-width: thin;
              scrollbar-color: #1e3a8a transparent;
            }
            .overflow-y-auto::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            .overflow-y-auto::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 3px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb {
              background-color: transparent;
              border-radius: 3px;
            }
            .overflow-y-auto:hover::-webkit-scrollbar-thumb {
              background-color: #1e3a8a;
            }
            .overflow-y-auto {
              scroll-behavior: smooth;
            }
          `}</style>

          <nav className="flex flex-col gap-1 px-2">
            {/* Dashboard Button */}
            <Link href="/employee" onClick={handleLinkClick}>
              <button
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#1e3a8a] transition duration-200 ease-in-out 
                  ${isActive(['/employee'])}
                  ${(isDesktopSidebarCollapsed && !isHovering) ? 'justify-center px-2' : ''}`}
              >
                <MdOutlineSpaceDashboard className='text-xl' />
                {(!isDesktopSidebarCollapsed || isHovering) && 'Dashboard'}
              </button>
            </Link>

            {/* QR Scan Button */}
            <Link href="/employee/QrScan" onClick={handleLinkClick}>
              <button
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#1e3a8a] transition duration-200 ease-in-out 
                  ${isActive(['/employee/QrScan'])}
                  ${(isDesktopSidebarCollapsed && !isHovering) ? 'justify-center px-2' : ''}`}
              >
                <MdQrCodeScanner className='text-xl' />
                {(!isDesktopSidebarCollapsed || isHovering) && 'QR Scan'}
              </button>
            </Link>

            {/* History Button */}
            <Link href="/employee/History" onClick={handleLinkClick}>
              <button
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#1e3a8a] transition duration-200 ease-in-out 
                  ${isActive(['/employee/History'])}
                  ${(isDesktopSidebarCollapsed && !isHovering) ? 'justify-center px-2' : ''}`}
              >
                <MdHistory className='text-xl' />
                {(!isDesktopSidebarCollapsed || isHovering) && 'History'}
              </button>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className={`flex items-center gap-3 px-3 py-3 mt-4 rounded-lg text-white transition duration-200 ease-in-out bg-[#1e3a8a] hover:bg-[#182848]
                ${(isDesktopSidebarCollapsed && !isHovering) ? 'justify-center px-2' : ''}`}
            >
              <MdExitToApp className="text-xl" />
              {(!isDesktopSidebarCollapsed || isHovering) && 'Log out'}
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 h-screen bg-gradient-to-b from-[#4080bf] to-[#6699cc] text-white p-4 flex flex-col gap-4 w-64 z-[100] transform transition-all duration-300 ease-in-out shadow-xl mobile-sidebar
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center relative gap-2 text-xl font-bold mb-4 text-center">
          <Link href="/Head" onClick={handleLinkClick}>
            <span className="text-white">Head Dashboard</span>
          </Link>
          <button
            className="p-2 text-white rounded absolute right-0 text-xl hover:bg-[#1e3a8a] transition-colors"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Scrollable Navigation for Mobile */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e3a8a] scrollbar-track-transparent hover:scrollbar-thumb-[#1e3a8a] scroll-smooth">
          <nav className="flex flex-col gap-1">
            {/* Dashboard Button */}
            <Link href="/employee" onClick={handleLinkClick}>
              <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#1e3a8a] transition duration-200 ease-in-out ${isActive(['/employee'])}`}>
                <MdOutlineSpaceDashboard className='text-xl' />
                Dashboard
              </button>
            </Link>

            {/* QR Scan Button */}
            <Link href="/employee/QrScan" onClick={handleLinkClick}>
              <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#1e3a8a] transition duration-200 ease-in-out ${isActive(['/employee/QrScan'])}`}>
                <MdQrCodeScanner className='text-xl' />
                QR Scan
              </button>
            </Link>

            {/* History Button */}
            <Link href="/employee/History" onClick={handleLinkClick}>
              <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#1e3a8a] transition duration-200 ease-in-out ${isActive(['/employee/History'])}`}>
                <MdHistory className='text-xl' />
                History
              </button>
            </Link>

            {/* Logout Button */}
            <button 
              onClick={handleLogoutClick} 
              className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg text-white transition duration-200 ease-in-out bg-[#1e3a8a] hover:bg-[#182848]"
            >
              <MdExitToApp className="text-xl" />
              Log out
            </button>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[99] transition-opacity duration-300"></div>
      )}
    </>
  );
}