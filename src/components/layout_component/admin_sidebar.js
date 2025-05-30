'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  MdOutlineSpaceDashboard,
  MdPeople,
  MdCalendarToday,
  MdAnalytics,
  MdExitToApp,
  MdChevronLeft,
  MdChevronRight,
  MdMenu,
  MdClose
} from "react-icons/md";
import Link from 'next/link';

export default function Admin_Sidebar({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  handleLogout,
  isDesktopSidebarCollapsed,
  toggleDesktopSidebar
}) {
  const pathname = usePathname();
  const [isHovering, setIsHovering] = useState(false);

  const isActive = (paths) => {
    return paths.includes(pathname) ? 'bg-[#077A7D] text-white shadow-md' : '';
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
          className="p-2 rounded-lg bg-[#077A7D] text-[#F5EEDD] shadow-md hover:bg-[#16404D] transition-colors"
        >
          {isMobileSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block bg-gradient-to-b from-[#06202B] to-[#16404D] text-[#F5EEDD] flex-col h-screen shadow-lg transition-all duration-300 ease-in-out fixed
          ${isDesktopSidebarCollapsed ? 'w-24' : 'w-72'} 
          ${isHovering && isDesktopSidebarCollapsed ? 'w-72' : ''}`}
        
      >
        {/* Collapse/Expand Button */}
        <div className="flex justify-end p-3">
          <button
            onClick={toggleDesktopSidebar}
            className="p-1 rounded-full hover:bg-[#077A7D] transition-colors duration-200 flex items-center justify-center"
            aria-label={isDesktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isDesktopSidebarCollapsed ? 
              <MdChevronRight size={22} className="text-[#F5EEDD]" /> : 
              <MdChevronLeft size={22} className="text-[#F5EEDD]" />
            }
          </button>
        </div>

        {/* Logo/Title */}
        <Link
          href="/admin"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 text-xl font-bold justify-center py-4 mx-2 rounded-lg transition duration-200 ease-in-out hover:bg-[#077A7D]
            ${(isDesktopSidebarCollapsed && !isHovering) ? 'px-2 justify-center' : 'px-4'}`}
        >
          {(isDesktopSidebarCollapsed && !isHovering) ? (
            <span className="text-[#F5EEDD] text-2xl font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-user-icon lucide-shield-user">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                <path d="M6.376 18.91a6 6 0 0 1 11.249.003"/>
                <circle cx="12" cy="11" r="4"/>
              </svg>
            </span>
          ) : (
            <span className="text-[#F5EEDD]">Admin Dashboard</span>
          )}
        </Link>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto pb-4">
          <style jsx>{`
            .overflow-y-auto {
              scrollbar-width: thin;
              scrollbar-color: #077A7D transparent;
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
              background-color: #077A7D;
            }
            .overflow-y-auto {
              scroll-behavior: smooth;
            }
          `}</style>

          <nav className="flex flex-col gap-1 px-2">
            {/* Dashboard Button */}
            <Link href="/admin" onClick={handleLinkClick}>
              <button
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#077A7D] transition duration-200 ease-in-out 
                  ${isActive(['/admin'])}
                  ${(isDesktopSidebarCollapsed && !isHovering) ? 'justify-center px-2' : ''}`}
              >
                <MdOutlineSpaceDashboard className='text-xl text-[#F5EEDD]' />
                {(!isDesktopSidebarCollapsed || isHovering) && 'Dashboard'}
              </button>
            </Link>

            {/* Employee Management Button */}
            <Link href="/admin/employee_management" onClick={handleLinkClick}>
              <button
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#077A7D] transition duration-200 ease-in-out 
                  ${isActive(['/admin/employee_management'])}
                  ${(isDesktopSidebarCollapsed && !isHovering) ? 'justify-center px-2' : ''}`}
              >
                <MdPeople className='text-xl text-[#F5EEDD]' />
                {(!isDesktopSidebarCollapsed || isHovering) && 'Employee Management'}
              </button>
            </Link>

            {/* Daily Attendance Button */}
            <Link href="/admin/daily_attendance" onClick={handleLinkClick}>
              <button
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#077A7D] transition duration-200 ease-in-out 
                  ${isActive(['/admin/daily_attendance'])}
                  ${(isDesktopSidebarCollapsed && !isHovering) ? 'justify-center px-2' : ''}`}
              >
                <MdCalendarToday className='text-xl text-[#F5EEDD]' />
                {(!isDesktopSidebarCollapsed || isHovering) && 'Daily Attendance'}
              </button>
            </Link>

            {/* Attendance Analysis Button */}
            <Link href="/admin/attendance_analysis" onClick={handleLinkClick}>
              <button
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#077A7D] transition duration-200 ease-in-out 
                  ${isActive(['/admin/attendance_analysis'])}
                  ${(isDesktopSidebarCollapsed && !isHovering) ? 'justify-center px-2' : ''}`}
              >
                <MdAnalytics className='text-xl text-[#F5EEDD]' />
                {(!isDesktopSidebarCollapsed || isHovering) && 'Attendance Analysis'}
              </button>
            </Link>

            {/* Holidays Button */}
            <Link href="/admin/holidays" onClick={handleLinkClick}>
              <button
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#077A7D] transition duration-200 ease-in-out 
                  ${isActive(['/admin/holidays'])}
                  ${(isDesktopSidebarCollapsed && !isHovering) ? 'justify-center px-2' : ''}`}
              >
                <MdCalendarToday className='text-xl text-[#F5EEDD]' />
                {(!isDesktopSidebarCollapsed || isHovering) && 'Holidays'}
              </button>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className={`flex items-center gap-3 px-3 py-3 mt-4 rounded-lg text-[#F5EEDD] transition duration-200 ease-in-out bg-[#077A7D] hover:bg-[#16404D]
                ${(isDesktopSidebarCollapsed && !isHovering) ? 'justify-center px-2' : ''}`}
            >
              <MdExitToApp className="text-xl" />
              {(!isDesktopSidebarCollapsed || isHovering) && 'Log out'}
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 h-screen bg-gradient-to-b from-[#06202B] to-[#16404D] text-[#F5EEDD] p-4 flex flex-col gap-4 w-64 z-[100] transform transition-all duration-300 ease-in-out shadow-xl mobile-sidebar
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center relative gap-2 text-xl font-bold mb-4 text-center">
          <Link href="/admin" onClick={handleLinkClick}>
            <span className="text-[#F5EEDD]">Admin Dashboard</span>
          </Link>
          <button
            className="p-2 text-[#F5EEDD] rounded absolute right-0 text-xl hover:bg-[#077A7D] transition-colors"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Scrollable Navigation for Mobile */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#077A7D] scrollbar-track-transparent hover:scrollbar-thumb-[#077A7D] scroll-smooth">
          <nav className="flex flex-col gap-1">
            {/* Dashboard Button */}
            <Link href="/admin" onClick={handleLinkClick}>
              <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#077A7D] transition duration-200 ease-in-out ${isActive(['/admin'])}`}>
                <MdOutlineSpaceDashboard className='text-xl text-[#F5EEDD]' />
                Dashboard
              </button>
            </Link>

            {/* Employee Management Button */}
            <Link href="/admin/employee_management" onClick={handleLinkClick}>
              <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#077A7D] transition duration-200 ease-in-out ${isActive(['/admin/employee_management'])}`}>
                <MdPeople className='text-xl text-[#F5EEDD]' />
                Employee Management
              </button>
            </Link>

            {/* Daily Attendance Button */}
            <Link href="/admin/daily_attendance" onClick={handleLinkClick}>
              <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#077A7D] transition duration-200 ease-in-out ${isActive(['/admin/daily_attendance'])}`}>
                <MdCalendarToday className='text-xl text-[#F5EEDD]' />
                Daily Attendance
              </button>
            </Link>

            {/* Attendance Analysis Button */}
            <Link href="/admin/attendance_analysis" onClick={handleLinkClick}>
              <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#077A7D] transition duration-200 ease-in-out ${isActive(['/admin/attendance_analysis'])}`}>
                <MdAnalytics className='text-xl text-[#F5EEDD]' />
                Attendance Analysis
              </button>
            </Link>

            {/* Holidays Button */}
            <Link href="/admin/holidays" onClick={handleLinkClick}>
              <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-left hover:bg-[#077A7D] transition duration-200 ease-in-out ${isActive(['/admin/holidays'])}`}>
                <MdCalendarToday className='text-xl text-[#F5EEDD]' />
                Holidays
              </button>
            </Link>

            {/* Logout Button */}
            <button 
              onClick={handleLogoutClick} 
              className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg text-[#F5EEDD] transition duration-200 ease-in-out bg-[#077A7D] hover:bg-[#16404D]"
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