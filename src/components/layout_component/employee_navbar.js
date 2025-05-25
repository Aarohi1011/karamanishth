'use client'

import { Bell, Search } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { MdMenu } from "react-icons/md";


export default function Employee_Navbar({ 
  toggleMobileSidebar,
  toggleDesktopSidebar 
})
{
  
  
  return (
    <div className="bg-white shadow-sm sticky top-0 z-[39] sm:z-50 lg:sm:50">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 text-[#4080bf] rounded-md hover:bg-gray-100"
        >
          <MdMenu className="h-5 w-5" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={toggleDesktopSidebar}
          className="hidden lg:block p-2 text-[#4080bf] rounded-md hover:bg-gray-100"
        >
          <MdMenu className="h-5 w-5" />
        </button>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search "
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4080bf] focus:border-[#4080bf] transition"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-[#4080bf] rounded-full hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <Link href="/employee/Profile">
            <div className="flex items-center gap-2">
              <FaUserCircle className="h-6 w-6 text-[#4080bf] hover:text-[#6699cc] transition" />
              <span className="hidden md:inline text-sm font-medium">Admin</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}