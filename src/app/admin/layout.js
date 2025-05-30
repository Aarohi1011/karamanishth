'use client'

import Admin_Navbar from "@/components/layout_component/admin_navbar";
import Admin_Sidebar from "@/components/layout_component/admin_sidebar";
// import Sidebar from "@/components/layout_component/HeadSidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      const data = await response.json();
      if (data.success) router.push('/login');
      else console.error('Logout failed:', data.msg);
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  const toggleDesktopSidebar = () => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="__variable_5cfdac __variable_9a8899 antialiased">
        <div className="flex h-full relative">
          {/* Desktop Sidebar */}
          <div className={`hidden lg:block sticky top-0 h-screen z-20 ${isDesktopSidebarCollapsed ? 'w-24' : 'w-72'
            }`}>
            <Admin_Sidebar
              isMobileSidebarOpen={isMobileSidebarOpen}
              setIsMobileSidebarOpen={setIsMobileSidebarOpen}
              handleLogout={handleLogout}
              isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
              toggleDesktopSidebar={toggleDesktopSidebar}
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
          {/* Mobile Sidebar */}
          <div className={`lg:hidden fixed top-0 left-0 h-screen z-40 transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            <Admin_Sidebar
              isMobileSidebarOpen={isMobileSidebarOpen}
              setIsMobileSidebarOpen={setIsMobileSidebarOpen}
              handleLogout={handleLogout}
              isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
              toggleDesktopSidebar={toggleDesktopSidebar}
            />
            
          </div>


          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full relative z-30">
            <Admin_Navbar
              toggleMobileSidebar={toggleMobileSidebar}
              toggleDesktopSidebar={toggleDesktopSidebar}
            />
            <main className="flex-1 overflow-y-auto">
              <div className="bg-gray-100 min-h-[calc(100vh-8rem)]">
                <div className="bg-white rounded-xl shadow-sm  ">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}