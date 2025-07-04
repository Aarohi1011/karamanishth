'use client'
import React, { useEffect } from 'react';
import { FiHome, FiClock, FiCalendar, FiDownload, FiLogOut, FiUserCheck, FiUserX, FiAlertCircle } from 'react-icons/fi';
import { auth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NotificationManager from '@/components/notificationmanager';

const EmployeeDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userid, setUserid] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [attendanceData, setAttendanceData] = useState(null);
  const [currentStatus, setCurrentStatus] = useState({
    isInShop: false,
    lastCheckIn: null,
    lastCheckOut: null,
    status: 'Absent'
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await auth();
        console.log(userData);
        if (userData === 'No Token') {
          router.push('/login');
        } else {
          setUserid(userData._id);
          setBusinessId(userData.businessId);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
        setIsLoading(false);
      }
    };

    getUserData();
  }, [router]);

  useEffect(() => {
    if (userid && businessId) {
      fetchAttendanceData();
    }
  }, [userid, businessId]);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`/api/employee/attendance?employeeId=${userid}&businessId=${businessId}`);
      const data = await response.json();
      console.log(data);
      
      setAttendanceData(data);
      
      // Determine current status based on API response
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const isToday = new Date(data.date).getTime() === today.getTime();
      
      if (isToday) {
        const newStatus = {
          isInShop: data.outTime === null,
          lastCheckIn: data.inTime ? new Date(data.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          lastCheckOut: data.outTime ? new Date(data.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          status: data.status
        };
        setCurrentStatus(newStatus);
      } else {
        setCurrentStatus({
          isInShop: false,
          lastCheckIn: null,
          lastCheckOut: null,
          status: 'Absent'
        });
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to load attendance data');
    }
  };

  const handleCheckInOut = async () => {
    try {
      const response = await fetch('/api/employee/checkinout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: userid,
          businessId: businessId,
          action: currentStatus.isInShop ? 'checkout' : 'checkin'
        })
      });
      
      if (response.ok) {
        fetchAttendanceData(); // Refresh data after successful check-in/out
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Sample data - replace with real data from your API
  const attendanceHistory = {
    presentDays: 22,
    absentDays: 3,
    lateDays: 2,
    averageHours: 8.5
  };

  const importantLinks = [
    { name: 'Monthly Report', icon: <FiDownload />, url: '#', color: 'bg-[#077A7D]' },
    { name: 'Leave Request', icon: <FiLogOut />, url: '#', color: 'bg-[#DDA853]' },
    { name: 'Holiday Calendar', icon: <FiCalendar />, url: '#', color: 'bg-[#16404D]' },
    { name: 'Emergency Contact', icon: <FiAlertCircle />, url: '#', color: 'bg-[#7AE2CF]' }
  ];

  const upcomingHolidays = [
    { date: '2023-12-25', name: 'Christmas Day' },
    { date: '2024-01-01', name: 'New Year Day' },
    { date: '2024-01-15', name: 'Company Anniversary' }
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#F5EEDD] to-[#A6CDC6] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EEDD] to-[#A6CDC6] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#06202B]">Employee Dashboard</h1>
          <p className="text-[#16404D]">Welcome back, {attendanceData?.employee?.name || 'Employee'}! Here is your daily overview.</p>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Card */}
          <div className="bg-[#FBF5DD] rounded-2xl shadow-lg overflow-hidden border border-[#DDA853]/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#06202B]">Current Status</h2>
                <div className={`p-2 rounded-full ${currentStatus.isInShop ? 'bg-[#7AE2CF]/20 text-[#077A7D]' : 'bg-[#A6CDC6]/20 text-[#16404D]'}`}>
                  {currentStatus.isInShop ? <FiUserCheck size={24} /> : <FiUserX size={24} />}
                </div>
              </div>
              <NotificationManager userId={userid} />
              {currentStatus.isInShop ? (
                <>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <p className="text-lg font-medium text-[#077A7D]">You are in the shop</p>
                  </div>
                  <p className="text-[#16404D] mb-4">Checked in at {currentStatus.lastCheckIn}</p>
                  <button 
                    onClick={handleCheckInOut}
                    className="w-full py-2 bg-gradient-to-r from-[#DDA853] to-[#F5EEDD] text-[#06202B] rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Check Out
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <p className="text-lg font-medium text-[#16404D]">You are not in the shop</p>
                  </div>
                  {currentStatus.lastCheckOut && (
                    <p className="text-[#16404D] mb-4">Last checked out at {currentStatus.lastCheckOut}</p>
                  )}
                  <button 
                    onClick={handleCheckInOut}
                    className="w-full py-2 bg-gradient-to-r from-[#077A7D] to-[#7AE2CF] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Check In
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Rest of your dashboard components remain the same */}
          {/* History Card */}
          <div className="bg-[#FBF5DD] rounded-2xl shadow-lg overflow-hidden border border-[#DDA853]/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#06202B]">Attendance History</h2>
                <div className="p-2 rounded-full bg-[#A6CDC6]/20 text-[#16404D]">
                  <FiClock size={24} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#7AE2CF]/10 p-4 rounded-lg">
                  <p className="text-sm text-[#16404D]">Present Days</p>
                  <p className="text-2xl font-bold text-[#077A7D]">{attendanceHistory.presentDays}</p>
                </div>
                <div className="bg-[#A6CDC6]/10 p-4 rounded-lg">
                  <p className="text-sm text-[#16404D]">Absent Days</p>
                  <p className="text-2xl font-bold text-[#16404D]">{attendanceHistory.absentDays}</p>
                </div>
                <div className="bg-[#DDA853]/10 p-4 rounded-lg">
                  <p className="text-sm text-[#16404D]">Late Days</p>
                  <p className="text-2xl font-bold text-[#DDA853]">{attendanceHistory.lateDays}</p>
                </div>
                <div className="bg-[#077A7D]/10 p-4 rounded-lg">
                  <p className="text-sm text-[#16404D]">Avg Hours</p>
                  <p className="text-2xl font-bold text-[#077A7D]">{attendanceHistory.averageHours}</p>
                </div>
              </div>

              <button className="w-full py-2 border border-[#16404D] text-[#16404D] rounded-lg font-medium hover:bg-[#16404D]/10 transition-colors">
                View Full History
              </button>
            </div>
          </div>

          {/* Links Card */}
          <div className="bg-[#FBF5DD] rounded-2xl shadow-lg overflow-hidden border border-[#DDA853]/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#06202B]">Quick Links</h2>
                <div className="p-2 rounded-full bg-[#DDA853]/20 text-[#DDA853]">
                  <FiHome size={24} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {importantLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className={`${link.color}/10 hover:${link.color}/20 p-4 rounded-lg flex flex-col items-center justify-center transition-colors`}
                  >
                    <div className={`${link.color} text-white p-3 rounded-full mb-2`}>
                      {link.icon}
                    </div>
                    <p className="text-sm font-medium text-[#16404D] text-center">{link.name}</p>
                  </a>
                ))}
              </div>

              <div>
                <h3 className="text-md font-semibold text-[#06202B] mb-2">Upcoming Holidays</h3>
                <ul className="space-y-2">
                  {upcomingHolidays.map((holiday, index) => (
                    <li key={index} className="flex items-center">
                      <FiCalendar className="text-[#077A7D] mr-2" />
                      <span className="text-[#16404D]">
                        {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {holiday.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Section - Recent Activity */}
        <div className="bg-[#FBF5DD] rounded-2xl shadow-lg overflow-hidden border border-[#DDA853]/20 p-6">
          <h2 className="text-xl font-semibold text-[#06202B] mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-[#A6CDC6]">
                  <th className="pb-2 text-[#16404D]">Date</th>
                  <th className="pb-2 text-[#16404D]">Check In</th>
                  <th className="pb-2 text-[#16404D]">Check Out</th>
                  <th className="pb-2 text-[#16404D]">Total Hours</th>
                  <th className="pb-2 text-[#16404D]">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData ? (
                  <tr className="border-b border-[#A6CDC6]/50 last:border-0">
                    <td className="py-3 text-[#16404D]">
                      {new Date(attendanceData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 text-[#16404D]">
                      {attendanceData.inTime ? new Date(attendanceData.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="py-3 text-[#16404D]">
                      {attendanceData.outTime ? new Date(attendanceData.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="py-3 text-[#16404D]">{attendanceData.workHours || '-'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        attendanceData.status === 'Present' ? 'bg-[#7AE2CF]/20 text-[#077A7D]' :
                        attendanceData.status === 'Late' ? 'bg-[#DDA853]/20 text-[#DDA853]' :
                        'bg-[#A6CDC6]/20 text-[#16404D]'
                      }`}>
                        {attendanceData.status}
                      </span>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="5" className="py-3 text-center text-[#16404D]">No attendance data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;