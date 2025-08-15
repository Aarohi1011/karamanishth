'use client'
import React, { useEffect } from 'react';
import { FiHome, FiClock, FiCalendar, FiDownload, FiUserCheck, FiUserX, FiAlertCircle, FiChevronLeft, FiChevronRight, FiCheckCircle, FiXCircle, FiTrendingUp } from 'react-icons/fi';
import { auth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NotificationManager from '@/components/notificationmanager';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EmployeeDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
  const [userid, setUserid] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [attendanceData, setAttendanceData] = useState(null);
  const [currentStatus, setCurrentStatus] = useState({
    isInShop: false,
    lastCheckIn: null,
    lastCheckOut: null,
    status: 'Loading...'
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyAttendance, setMonthlyAttendance] = useState({
    monthLabel: '',
    totalDays: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalEarlyLeave: 0,
    averageWorkHours: 0,
    records: []
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await auth();
        if (userData === 'No Token') {
          router.push('/login');
        } else {
          setUserid(userData._id);
          setBusinessId(userData.businessId);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    getUserData();
  }, [router]);

  useEffect(() => {
    if (userid && businessId) {
      fetchAttendanceData();
      fetchMonthlyAttendance();
    }
  }, [userid, businessId, selectedMonth, selectedYear]);

  // Helper function to derive a single status from a record
  const getDayStatus = (record) => {
    // Guard clause for cases with no data
    if (!record || !record.inStatus) {
      return 'Absent';
    }
    if (record.inStatus === 'Absent' && record.outStatus === 'Absent') {
      return 'Absent';
    }
    if (record.inStatus === 'Leave' || record.outStatus === 'Leave') {
      return 'Leave';
    }
    if (record.inStatus === 'Half-Day' || record.outStatus === 'Half-Day') {
      return 'Half-Day';
    }
    // Priority for display: Late is shown even if they also leave early
    if (record.inStatus === 'Late') {
      return 'Late';
    }
    if (record.outStatus === 'Early Leave') {
      return 'Early Leave';
    }
    // If none of the above, they are present
    return 'Present';
  };

  const fetchAttendanceData = async () => {
    try {
      setIsAttendanceLoading(true);
      setCurrentStatus(prev => ({ ...prev, status: 'Loading...' }));

      const response = await fetch(`/api/employee/attendance?employeeId=${userid}&businessId=${businessId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const todaysRecord = result.data;
        const derivedStatus = getDayStatus(todaysRecord);

        // Set attendance data for the "Today's Attendance" table, adding the derived status
        setAttendanceData({
          ...todaysRecord,
          status: derivedStatus,
        });
        
        // Set the current status for the main dashboard card
        setCurrentStatus({
          isInShop: !!todaysRecord.inTime && !todaysRecord.outTime,
          lastCheckIn: todaysRecord.inTime ? formatTime(todaysRecord.inTime) : null,
          lastCheckOut: todaysRecord.outTime ? formatTime(todaysRecord.outTime) : null,
          status: derivedStatus,
        });
      } else {
        // Handle cases where no record is found for today (employee is absent)
        setAttendanceData(null);
        setCurrentStatus({
          isInShop: false,
          lastCheckIn: null,
          lastCheckOut: null,
          status: 'Absent',
        });
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setCurrentStatus({
        isInShop: false,
        lastCheckIn: null,
        lastCheckOut: null,
        status: 'Error loading data',
      });
    } finally {
      setIsAttendanceLoading(false);
    }
  };

  const fetchMonthlyAttendance = async () => {
    try {
      const monthParam = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
      const response = await fetch(`/api/employee/attendance/history?employeeId=${userid}&businessId=${businessId}&month=${monthParam}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setMonthlyAttendance(result.data);
      }
    } catch (error) {
      console.error('Error fetching monthly attendance:', error);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleCheckInOut = async () => {
    try {
      setIsAttendanceLoading(true);
      const response = await fetch('/api/employee/checkinout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: userid,
          businessId: businessId,
          action: currentStatus.isInShop ? 'checkout' : 'checkin'
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        await fetchAttendanceData(); // Refresh data after action
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsAttendanceLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Present: 'bg-[#7AE2CF] text-[#16404D]',
      Absent: 'bg-[#F5EEDD] text-[#DDA853] border border-[#DDA853]',
      Late: 'bg-[#DDA853]/20 text-[#DDA853]',
      'Early Leave': 'bg-[#DDA853]/30 text-[#DDA853]',
      'Half-Day': 'bg-[#A6CDC6] text-[#16404D]',
      Leave: 'bg-[#F5EEDD] text-[#16404D] border border-[#16404D]'
    };
    return styles[status] || 'bg-gray-200 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Present: <FiCheckCircle className="mr-1" />,
      Absent: <FiXCircle className="mr-1" />,
      Late: <FiClock className="mr-1" />,
      'Early Leave': <FiClock className="mr-1" />,
      'Half-Day': <FiTrendingUp className="mr-1" />,
      Leave: <FiXCircle className="mr-1" />
    };
    return icons[status] || null;
  };

  const monthlyChartData = {
    labels: monthlyAttendance.records.map(record => 
      new Date(record.date).getDate()
    ),
    datasets: [
      {
        label: 'Working Hours',
        data: monthlyAttendance.records.map(record => record.workHours),
        backgroundColor: '#077A7D',
        borderColor: '#16404D',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#16404D',
          font: { family: 'sans-serif' }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#16404D' },
        grid: { color: '#A6CDC6' }
      },
      x: {
        ticks: { color: '#16404D' },
        grid: { color: '#A6CDC6' }
      }
    }
  };

  const calculateWorkHours = (inTime, outTime) => {
    if (!inTime || !outTime) return 'N/A';
    
    const start = new Date(inTime);
    const end = new Date(outTime);
    const diffMs = end - start;
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    
    return `${diffHrs}h ${diffMins}m`;
  };

  // --- MODIFICATION START ---
  // Removed 'Leave Request' and 'Emergency Contact' from this array
  const importantLinks = [
    { name: 'Monthly Report', icon: <FiDownload />, url: '#', color: 'bg-[#077A7D]' },
    { name: 'Holiday Calendar', icon: <FiCalendar />, url: '#', color: 'bg-[#16404D]' }
  ];
  // --- MODIFICATION END ---


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EEDD] to-[#A6CDC6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#077A7D] mx-auto"></div>
          <p className="mt-4 text-[#16404D]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EEDD] to-[#A6CDC6] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#06202B]">Employee Dashboard</h1>
          <p className="text-[#16404D]">
            Welcome back! Here is your daily overview.
          </p>
        </header>

        {!showHistory ? (
          <>
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Status Card */}
              <div className="bg-[#FBF5DD] rounded-2xl shadow-lg overflow-hidden border border-[#DDA853]/20">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#06202B]">Current Status</h2>
                    {isAttendanceLoading ? (
                      <div className="p-2 rounded-full bg-gray-200 text-gray-400">
                        <div className="animate-pulse rounded-full h-6 w-6"></div>
                      </div>
                    ) : (
                      <div className={`p-2 rounded-full ${currentStatus.isInShop ? 'bg-[#7AE2CF]/20 text-[#077A7D]' : 'bg-[#A6CDC6]/20 text-[#16404D]'}`}>
                        {currentStatus.isInShop ? <FiUserCheck size={24} /> : <FiUserX size={24} />}
                      </div>
                    )}
                  </div>
                  <NotificationManager userId={userid} />

                  {isAttendanceLoading ? (
                    <div className="space-y-4">
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="animate-pulse h-10 bg-gray-200 rounded mt-4"></div>
                    </div>
                  ) : currentStatus.status === 'Loading...' ? (
                    <div className="text-center py-4 text-[#16404D]">
                      Loading attendance status...
                    </div>
                  ) : currentStatus.status !== 'Absent' && currentStatus.status !== 'No data available' ? (
                    <>
                      <div className="flex items-center mb-2">
                        <div className={`w-3 h-3 rounded-full mr-2 ${currentStatus.status === 'Present' ? 'bg-green-500' :
                            currentStatus.status === 'Late' || currentStatus.status === 'Early Leave' ? 'bg-yellow-500' :
                              'bg-gray-500'
                          }`}></div>
                        <p className="text-lg font-medium text-[#077A7D]">
                          {currentStatus.isInShop ? 'You are in the shop' : 'You were in the shop today'}
                        </p>
                      </div>
                      {currentStatus.lastCheckIn && (
                        <p className="text-[#16404D] mb-2">Checked in at {currentStatus.lastCheckIn}</p>
                      )}
                      {currentStatus.lastCheckOut && (
                        <p className="text-[#16404D] mb-4">Checked out at {currentStatus.lastCheckOut}</p>
                      )}
                      {currentStatus.isInShop ? (
                        <button
                          onClick={handleCheckInOut}
                          disabled={isAttendanceLoading}
                          className={`w-full py-2 bg-gradient-to-r from-[#DDA853] to-[#F5EEDD] text-[#06202B] rounded-lg font-medium hover:opacity-90 transition-opacity ${isAttendanceLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                          {isAttendanceLoading ? 'Processing...' : 'Check Out'}
                        </button>
                      ) : (
                        <p className="text-sm text-[#16404D] italic">You have completed your work for today</p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <p className="text-lg font-medium text-[#16404D]">
                          {currentStatus.status === 'No data available' ? 'No attendance data' : 'You are not in the shop'}
                        </p>
                      </div>
                      <p className="text-[#16404D] mb-4">
                        {currentStatus.status === 'No data available' ? 'No attendance record found for today' : 'You haven\'t checked in today'}
                      </p>
                      <button
                        onClick={handleCheckInOut}
                        disabled={isAttendanceLoading || currentStatus.status === 'No data available'}
                        className={`w-full py-2 bg-gradient-to-r from-[#077A7D] to-[#7AE2CF] text-white rounded-lg font-medium hover:opacity-90 transition-opacity ${isAttendanceLoading || currentStatus.status === 'No data available' ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                      >
                        {isAttendanceLoading ? 'Processing...' : 'Check In'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-[#FBF5DD] rounded-2xl shadow-lg overflow-hidden border border-[#DDA853]/20">
                 <div className="p-6">
                   <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-semibold text-[#06202B]">Monthly Stats</h2>
                     <div className="p-2 rounded-full bg-[#A6CDC6]/20 text-[#16404D]">
                       <FiClock size={24} />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-4">
                     <div className="bg-[#7AE2CF]/10 p-4 rounded-lg">
                       <p className="text-sm text-[#16404D]">Present Days</p>
                       <p className="text-2xl font-bold text-[#077A7D]">{monthlyAttendance.totalPresent}</p>
                     </div>
                     <div className="bg-[#A6CDC6]/10 p-4 rounded-lg">
                       <p className="text-sm text-[#16404D]">Absent Days</p>
                       <p className="text-2xl font-bold text-[#16404D]">{monthlyAttendance.totalAbsent}</p>
                     </div>
                     <div className="bg-[#DDA853]/10 p-4 rounded-lg">
                       <p className="text-sm text-[#16404D]">Late Days</p>
                       <p className="text-2xl font-bold text-[#DDA853]">{monthlyAttendance.totalLate}</p>
                     </div>
                     <div className="bg-[#077A7D]/10 p-4 rounded-lg">
                       <p className="text-sm text-[#16404D]">Avg Hours</p>
                       <p className="text-2xl font-bold text-[#077A7D]">{monthlyAttendance.averageWorkHours.toFixed(1)}</p>
                     </div>
                   </div>

                   <button 
                     onClick={() => setShowHistory(true)}
                     className="w-full py-2 border border-[#16404D] text-[#16404D] rounded-lg font-medium hover:bg-[#16404D]/10 transition-colors"
                   >
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

                   <div className="grid grid-cols-2 gap-4">
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
                 </div>
               </div>
            </div>

            {/* Today's Attendance */}
            <div className="bg-[#FBF5DD] rounded-2xl shadow-lg overflow-hidden border border-[#DDA853]/20 p-6 mb-8">
              <h2 className="text-xl font-semibold text-[#06202B] mb-4">Todays Attendance</h2>
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
                          {formatDate(attendanceData.date)}
                        </td>
                        <td className="py-3 text-[#16404D]">
                          {formatTime(attendanceData.inTime)}
                        </td>
                        <td className="py-3 text-[#16404D]">
                          {formatTime(attendanceData.outTime)}
                        </td>
                        <td className="py-3 text-[#16404D]">
                          {attendanceData.inTime && attendanceData.outTime
                            ? calculateWorkHours(attendanceData.inTime, attendanceData.outTime)
                            : attendanceData.workHours ? `${attendanceData.workHours.toFixed(1)}h` : '-'}
                        </td>
                        <td className="py-3">
                           <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(attendanceData.status)}`}>
                             {getStatusIcon(attendanceData.status)}
                             {attendanceData.status}
                           </span>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-3 text-center text-[#16404D]">
                          {isAttendanceLoading ? 'Loading data...' : 'No attendance data available for today'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Monthly Chart */}
            <div className="bg-[#FBF5DD] rounded-2xl shadow-lg overflow-hidden border border-[#DDA853]/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#06202B]">Monthly Attendance Overview</h2>
                <div className="flex items-center">
                  <button 
                    className="p-1 md:p-2 rounded-full hover:bg-[#A6CDC6]/30"
                    onClick={() => {
                      const newMonth = selectedMonth > 0 ? selectedMonth - 1 : 11;
                      const newYear = newMonth === 11 ? selectedYear - 1 : selectedYear;
                      setSelectedMonth(newMonth);
                      setSelectedYear(newYear);
                    }}
                  >
                    <FiChevronLeft className="text-[#16404D]" />
                  </button>
                  <div className="mx-2 text-sm md:text-base font-medium text-[#16404D]">
                    {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </div>
                  <button 
                    className="p-1 md:p-2 rounded-full hover:bg-[#A6CDC6]/30"
                    onClick={() => {
                      const newMonth = selectedMonth < 11 ? selectedMonth + 1 : 0;
                      const newYear = newMonth === 0 ? selectedYear + 1 : selectedYear;
                      setSelectedMonth(newMonth);
                      setSelectedYear(newYear);
                    }}
                  >
                    <FiChevronRight className="text-[#16404D]" />
                  </button>
                </div>
              </div>
              <div className="h-64">
                <Bar data={monthlyChartData} options={chartOptions} />
              </div>
            </div>
          </>
        ) : (
           // The history view code remains unchanged
           <div className="bg-[#FBF5DD] rounded-2xl shadow-lg overflow-hidden border border-[#DDA853]/20">
             {/* Month Selector */}
             <div className="p-3 border-b border-[#A6CDC6] flex items-center justify-between bg-[#F5EEDD]">
               <button 
                 className="p-1 md:p-2 rounded-full hover:bg-[#A6CDC6]/30"
                 onClick={() => {
                   const newMonth = selectedMonth > 0 ? selectedMonth - 1 : 11;
                   const newYear = newMonth === 11 ? selectedYear - 1 : selectedYear;
                   setSelectedMonth(newMonth);
                   setSelectedYear(newYear);
                 }}
               >
                 <FiChevronLeft className="text-[#16404D]" />
               </button>
               <div className="flex items-center">
                 <FiCalendar className="text-[#077A7D] mr-2" />
                 <span className="text-sm md:text-base font-medium text-[#16404D]">
                   {monthlyAttendance.monthLabel || 
                     new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                 </span>
               </div>
               <button 
                 className="p-1 md:p-2 rounded-full hover:bg-[#A6CDC6]/30"
                 onClick={() => {
                   const newMonth = selectedMonth < 11 ? selectedMonth + 1 : 0;
                   const newYear = newMonth === 0 ? selectedYear + 1 : selectedYear;
                   setSelectedMonth(newMonth);
                   setSelectedYear(newYear);
                 }}
               >
                 <FiChevronRight className="text-[#16404D]" />
               </button>
             </div>

             {/* Content Area */}
             <div className="p-4 md:p-6">
               <div className="space-y-6">
                 {/* Stats Summary */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   <div className="bg-white p-3 rounded-lg border border-[#A6CDC6] text-center">
                     <div className="text-xs text-[#077A7D]">Present</div>
                     <div className="text-xl font-bold text-[#16404D]">
                       {monthlyAttendance.totalPresent}
                     </div>
                   </div>
                   <div className="bg-white p-3 rounded-lg border border-[#A6CDC6] text-center">
                     <div className="text-xs text-[#DDA853]">Late</div>
                     <div className="text-xl font-bold text-[#16404D]">
                       {monthlyAttendance.totalLate}
                     </div>
                   </div>
                   <div className="bg-white p-3 rounded-lg border border-[#A6CDC6] text-center">
                     <div className="text-xs text-[#16404D]">Absent</div>
                     <div className="text-xl font-bold text-[#16404D]">
                       {monthlyAttendance.totalAbsent}
                     </div>
                   </div>
                   <div className="bg-white p-3 rounded-lg border border-[#A6CDC6] text-center">
                     <div className="text-xs text-[#077A7D]">Avg. Hours</div>
                     <div className="text-xl font-bold text-[#16404D]">
                       {monthlyAttendance.averageWorkHours.toFixed(1)}
                     </div>
                   </div>
                 </div>

                 {/* Chart */}
                 <div className="bg-white p-3 rounded-lg border border-[#A6CDC6]">
                   <h3 className="text-base md:text-lg font-semibold text-[#16404D] mb-3 flex items-center">
                     <FiTrendingUp className="mr-2 text-[#077A7D]" />
                     Daily Working Hours
                   </h3>
                   <div className="h-48 md:h-56">
                     <Bar data={monthlyChartData} options={chartOptions} />
                   </div>
                 </div>

                 {/* Attendance Records */}
                 <div>
                   <h3 className="text-base md:text-lg font-semibold text-[#16404D] mb-3">Daily Records</h3>
                   
                   {/* Mobile Card View */}
                   <div className="md:hidden space-y-3">
                     {monthlyAttendance.records.map((record, index) => {
                       const status = getDayStatus(record);
                       return (
                         <div 
                           key={index} 
                           className="bg-white p-3 rounded-lg border border-[#A6CDC6]"
                         >
                           <div className="flex justify-between items-start mb-2">
                             <div>
                               <p className="font-medium text-[#16404D]">
                                 {formatDate(record.date)}
                               </p>
                               <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
                                 {getStatusIcon(status)}
                                 {status}
                               </span>
                             </div>
                             <p className="text-sm font-medium text-[#077A7D]">
                               {record.workHours ? record.workHours.toFixed(1) + 'h' : '-'}
                             </p>
                           </div>
                           <div className="grid grid-cols-2 gap-2 text-sm">
                             <div>
                               <p className="text-[#16404D]/70">Time In</p>
                               <p className="font-medium">{formatTime(record.inTime)}</p>
                               {record.inStatus && record.inStatus !== 'Absent' && (
                                 <span className={`text-xs ${record.inStatus === 'Late' ? 'text-[#DDA853]' : 'text-[#077A7D]'}`}>
                                   ({record.inStatus})
                                 </span>
                               )}
                             </div>
                             <div>
                               <p className="text-[#16404D]/70">Time Out</p>
                               <p className="font-medium">{formatTime(record.outTime)}</p>
                               {record.outStatus && record.outStatus !== 'Absent' && (
                                 <span className={`text-xs ${record.outStatus === 'Early Leave' ? 'text-[#DDA853]' : 'text-[#077A7D]'}`}>
                                   ({record.outStatus})
                                 </span>
                               )}
                             </div>
                           </div>
                           {record.notes && (
                             <div className="mt-2 text-sm">
                               <p className="text-[#16404D]/70">Notes</p>
                               <p className="font-medium">{record.notes}</p>
                             </div>
                           )}
                         </div>
                       );
                     })}
                   </div>

                   {/* Desktop Table View */}
                   <div className="hidden md:block overflow-x-auto">
                     <table className="w-full border-collapse">
                       <thead>
                         <tr className="bg-[#7AE2CF]/30 text-[#16404D]">
                           <th className="p-2 text-left rounded-tl-lg text-sm">Date</th>
                           <th className="p-2 text-left text-sm">Status</th>
                           <th className="p-2 text-left text-sm">Time In</th>
                           <th className="p-2 text-left text-sm">In Status</th>
                           <th className="p-2 text-left text-sm">Time Out</th>
                           <th className="p-2 text-left text-sm">Out Status</th>
                           <th className="p-2 text-left text-sm">Hours</th>
                           <th className="p-2 text-left rounded-tr-lg text-sm">Notes</th>
                         </tr>
                       </thead>
                       <tbody>
                         {monthlyAttendance.records.map((record, index) => {
                           const status = getDayStatus(record);
                           return (
                             <tr 
                               key={index} 
                               className={`border-b border-[#A6CDC6] ${index % 2 === 0 ? 'bg-[#FBF5DD]' : 'bg-[#F5EEDD]'}`}
                             >
                               <td className="p-2 text-sm">
                                 {formatDate(record.date)}
                               </td>
                               <td className="p-2">
                                 <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
                                   {getStatusIcon(status)}
                                   {status}
                                 </span>
                               </td>
                               <td className="p-2 text-sm">{formatTime(record.inTime)}</td>
                               <td className="p-2 text-sm">
                                 <span className={`${record.inStatus === 'Late' ? 'text-[#DDA853]' : 'text-[#077A7D]'}`}>
                                   {record.inStatus}
                                 </span>
                               </td>
                               <td className="p-2 text-sm">{formatTime(record.outTime)}</td>
                               <td className="p-2 text-sm">
                                 <span className={`${record.outStatus === 'Early Leave' ? 'text-[#DDA853]' : 'text-[#077A7D]'}`}>
                                   {record.outStatus}
                                 </span>
                               </td>
                               <td className="p-2 text-sm font-medium">
                                 {record.workHours ? record.workHours.toFixed(1) + 'h' : '-'}
                               </td>
                               <td className="p-2 text-sm max-w-[150px] truncate" title={record.notes}>
                                 {record.notes || '-'}
                               </td>
                             </tr>
                           );
                         })}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </div>
             </div>

             {/* Footer */}
             <div className="bg-[#F5EEDD] p-3 border-t border-[#A6CDC6] flex justify-center">
               <button 
                 onClick={() => setShowHistory(false)}
                 className="px-4 py-2 bg-[#16404D] text-white rounded-lg font-medium hover:bg-[#16404D]/90 transition-colors"
               >
                 Back to Dashboard
               </button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;