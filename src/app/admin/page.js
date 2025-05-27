'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { FiUsers, FiCalendar, FiAward, FiCheckCircle, FiXCircle, FiPlus } from 'react-icons/fi'
import Link from 'next/link'
const AdminDashboard = () => {
  const router = useRouter()

  // Sample data - in a real app, this would come from an API
  const stats = {
    totalEmployees: 42,
    presentToday: 35,
    absentToday: 7,
    topPerformer: {
      name: "Sarah Johnson",
      attendance: "98%",
      position: "Senior Developer"
    },
    upcomingHoliday: {
      name: "Diwali",
      date: "November 12, 2023",
      daysLeft: 14
    }
  }

  return (
    <div className="min-h-screen bg-[#F5EEDD] p-6">
      <h1 className="text-3xl font-bold text-[#06202B] mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Employee Count Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-[#077A7D]/10">
                <FiUsers className="text-[#077A7D] text-2xl" />
              </div>
              <span className="text-sm font-medium text-[#16404D]">Total</span>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-bold text-[#06202B]">{stats.totalEmployees}</h3>
              <p className="text-[#16404D] mt-1">Employees</p>
            </div>
            <button 
              onClick={() => router.push('/employees/add')}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#077A7D] hover:bg-[#16404D] text-white py-2 px-4 rounded-lg transition-colors duration-300"
            >
              <FiPlus /> Add Employee
            </button>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-[#DDA853]/10">
                <FiCheckCircle className="text-[#DDA853] text-2xl" />
              </div>
              <span className="text-sm font-medium text-[#16404D]">Today</span>
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-3xl font-bold text-[#06202B]">{stats.presentToday}</h3>
                <p className="text-[#16404D] mt-1 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Present
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-3xl font-bold text-[#06202B]">{stats.absentToday}</h3>
                <p className="text-[#16404D] mt-1 flex items-center justify-end">
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  Absent
                </p>
              </div>
            </div>
            <Link href='/admin/daily_attendance'>
            <button 
              onClick={() => router.push('/attendance/daily')}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#DDA853] hover:bg-[#c4903a] text-white py-2 px-4 rounded-lg transition-colors duration-300"
              >
              View Daily Attendance
            </button>
            </Link>
          </div>
        </div>

        {/* Top Performer Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-[#7AE2CF]/10">
                <FiAward className="text-[#7AE2CF] text-2xl" />
              </div>
              <span className="text-sm font-medium text-[#16404D]">Top Performer</span>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#077A7D] flex items-center justify-center text-white font-bold">
                  {stats.topPerformer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#06202B]">{stats.topPerformer.name}</h3>
                  <p className="text-[#16404D]">{stats.topPerformer.position}</p>
                </div>
              </div>
              <div className="mt-4 bg-[#FBF5DD] p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-[#16404D]">Attendance</span>
                  <span className="font-bold text-[#077A7D]">{stats.topPerformer.attendance}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-[#077A7D] h-2 rounded-full" 
                    style={{ width: stats.topPerformer.attendance }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Holidays Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-[#A6CDC6]/10">
                <FiCalendar className="text-[#A6CDC6] text-2xl" />
              </div>
              <span className="text-sm font-medium text-[#16404D]">Upcoming</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-[#06202B]">{stats.upcomingHoliday.name}</h3>
              <p className="text-[#16404D] mt-1">{stats.upcomingHoliday.date}</p>
              <div className="mt-4 bg-[#FBF5DD] p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-[#16404D]">Days Left</span>
                  <span className="font-bold text-[#077A7D]">{stats.upcomingHoliday.daysLeft}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => router.push('/admin/holidays')}
              className="mt-6 w-full flex items-center justify-center gap-2 border border-[#077A7D] text-[#077A7D] hover:bg-[#077A7D] hover:text-white py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Manage Holidays
            </button>
          </div>
        </div>
      </div>

      {/* Additional Analytics Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-[#06202B] mb-6">Employee Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Trend Chart Placeholder */}
          <div className="bg-[#FBF5DD] p-4 rounded-lg">
            <h3 className="font-bold text-[#077A7D] mb-3">Monthly Attendance Trend</h3>
            <div className="h-64 bg-white rounded flex items-center justify-center text-[#16404D]">
              [Chart: Monthly Attendance Trend]
            </div>
          </div>
          
          {/* Department-wise Stats Placeholder */}
          <div className="bg-[#FBF5DD] p-4 rounded-lg">
            <h3 className="font-bold text-[#077A7D] mb-3">Department Performance</h3>
            <div className="h-64 bg-white rounded flex items-center justify-center text-[#16404D]">
              [Chart: Department-wise Stats]
            </div>
          </div>
          
          {/* Recent Activities Placeholder */}
          <div className="bg-[#FBF5DD] p-4 rounded-lg">
            <h3 className="font-bold text-[#077A7D] mb-3">Recent Activities</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-[#16404D]">Employee #{item} marked present</p>
                  <p className="text-xs text-[#A6CDC6] mt-1">2 hours ago</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard