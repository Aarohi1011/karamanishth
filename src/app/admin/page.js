'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiCalendar, FiAward, FiCheckCircle, FiPlus, FiArrowRight, FiXCircle, FiClock, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import { auth } from '../lib/auth';

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
  });
  // --- MODIFICATION START ---
  // State for the new lists
  const [absentEmployees, setAbsentEmployees] = useState([]);
  const [lateEmployees, setLateEmployees] = useState([]);
  // --- MODIFICATION END ---

  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await auth();
        if (userData === 'No Token') {
          router.push('/login');
        } else {
          setBusinessId(userData.businessId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      }
    };
    getUserData();
  }, [router]);
  
  // --- MODIFICATION START ---
  // Encapsulate fetching logic in a useCallback for reusability (e.g., for the refresh button)
  const fetchDashboardData = useCallback(async () => {
    if (!businessId) return;

    setLoading(true); // Show loading state on refresh
    try {
      const [employeesResponse, attendanceResponse] = await Promise.all([
        fetch('/api/business/getemployee'),
        fetch(`/api/business/attendance?businessId=${businessId}`),
      ]);

      const employeesData = await employeesResponse.json();
      const attendanceData = await attendanceResponse.json();
      
      if (!employeesData.success || !attendanceData.success) {
        throw new Error('Failed to fetch dashboard data');
      }

      const allEmployees = employeesData.data.filter(emp => emp.role !== 'Owner');
      const totalEmployees = allEmployees.length;
      
      const attendanceSummary = attendanceData.data;
      const todaysAttendanceRecords = attendanceSummary?.employees || [];

      // Create a map of employees for easy name lookup
      const employeeMap = new Map(allEmployees.map(emp => [emp._id, emp.name]));
      
      // Create a Set of employee IDs who are present for efficient checking
      const presentEmployeeIds = new Set(todaysAttendanceRecords.map(att => att.employeeId));

      // NEW LOGIC: Any record means present. No record means absent.
      const presentToday = presentEmployeeIds.size;
      const absentToday = totalEmployees - presentToday;

      // Generate list of absent employee names
      const absentList = allEmployees
        .filter(emp => !presentEmployeeIds.has(emp._id))
        .map(emp => emp.name);

      // Generate list of late employee names
      const lateList = todaysAttendanceRecords
        .filter(att => att.inStatus === 'Late')
        .map(att => employeeMap.get(att.employeeId) || 'Unknown Employee');
      
      setStats({
        totalEmployees,
        presentToday,
        absentToday,
        lateToday: lateList.length,
      });

      setAbsentEmployees(absentList);
      setLateEmployees(lateList);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [businessId]);
  // --- MODIFICATION END ---

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EEDD] p-6 flex items-center justify-center">
        <div className="text-[#06202B]">Loading dashboard...</div>
      </div>
    );
  }

  const StatItem = ({ value, label, color }) => (
    <div className="text-center bg-slate-50 p-3 rounded-lg border">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );

  // --- MODIFICATION START ---
  // Component for list cards (Absent/Late)
  const InfoListCard = ({ title, icon, list, emptyMessage, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full bg-${color}-500/10`}>
          {icon}
        </div>
        <h3 className={`font-bold text-lg text-${color}-600`}>{title} ({list.length})</h3>
      </div>
      <div className="mt-4 flex-grow custom-scrollbar overflow-y-auto max-h-48 pr-2">
        {list.length > 0 ? (
          <ul className="space-y-2">
            {list.map((name, index) => (
              <li key={index} className="text-gray-700 bg-gray-50 p-2 rounded-md text-sm">{name}</li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
  // --- MODIFICATION END ---


  return (
    <div className="min-h-screen bg-[#F5EEDD] p-6">
      <div className="max-w-7xl mx-auto">
        {/* --- MODIFICATION START --- */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#06202B]">Admin Dashboard</h1>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 bg-[#077A7D] text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-[#16404D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#077A7D]"
            aria-label="Refresh Dashboard Data"
          >
            <FiRefreshCw className="animate-spin" style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
        {/* --- MODIFICATION END --- */}
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Employee Count Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
            <div className="p-6 flex-grow">
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
            </div>
            <div className='p-6 pt-0'>
              <button 
                onClick={() => router.push('/admin/employee_management')}
                className="w-full flex items-center justify-center gap-2 bg-[#077A7D] hover:bg-[#16404D] text-white py-2 px-4 rounded-lg transition-colors duration-300"
              >
                <FiPlus /> Add Employee
              </button>
            </div>
          </div>

          {/* --- MODIFICATION START --- */}
          {/* Attendance Card (Simplified) */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
            <div className="p-6 flex-grow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-[#DDA853]/10">
                  <FiCheckCircle className="text-[#DDA853] text-2xl" />
                </div>
                <span className="text-sm font-medium text-[#16404D]">Today's Attendance</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatItem value={stats.presentToday} label="Present" color="text-green-500" />
                <StatItem value={stats.absentToday} label="Absent" color="text-red-500" />
              </div>
            </div>
            <div className='p-6 pt-0'>
              <button 
                onClick={() => router.push('/admin/daily_attendance')}
                className="w-full flex items-center justify-center gap-2 border border-[#077A7D] text-[#077A7D] hover:bg-[#077A7D] hover:text-white py-2 px-4 rounded-lg transition-colors duration-300"
              >
                View Details <FiArrowRight />
              </button>
            </div>
          </div>
          {/* --- MODIFICATION END --- */}

          {/* Quick Report Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
            <div className="p-6 flex-grow">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-full bg-[#7AE2CF]/10">
                  <FiAward className="text-[#7AE2CF] text-2xl" />
                </div>
                <span className="text-sm font-medium text-[#16404D]">Quick Reports</span>
              </div>
              <div className="mt-6 space-y-4">
                <button 
                  onClick={() => router.push('/admin/daily_attendance')}
                  className="w-full flex items-center justify-between gap-2 border border-[#077A7D] text-[#077A7D] hover:bg-[#077A7D] hover:text-white py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  <span>Daily Attendance</span>
                  <FiCalendar />
                </button>
                <button 
                  onClick={() => router.push('/admin/reports')}
                  className="w-full flex items-center justify-between gap-2 border border-[#DDA853] text-[#DDA853] hover:bg-[#DDA853] hover:text-white py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  <span>Monthly Reports</span>
                  <FiCalendar />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- MODIFICATION START --- */}
        {/* New Informational List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InfoListCard 
                title="Absent Today"
                icon={<FiXCircle className="text-red-500 text-2xl" />}
                list={absentEmployees}
                emptyMessage="🎉 Everyone is present!"
                color="red"
            />
            <InfoListCard 
                title="Late Comers Today"
                icon={<FiClock className="text-yellow-500 text-2xl" />}
                list={lateEmployees}
                emptyMessage="👍 No late arrivals today."
                color="yellow"
            />
        </div>
        {/* --- MODIFICATION END --- */}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/employee_management">
            <div className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-[#077A7D]/10 group-hover:bg-[#077A7D]/20 transition-colors duration-300">
                  <FiUsers className="text-[#077A7D] text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-[#077A7D]">Employees</h3>
                  <p className="text-[#16404D] mt-1">Manage your team</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/daily_attendance">
            <div className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-[#DDA853]/10 group-hover:bg-[#DDA853]/20 transition-colors duration-300">
                  <FiCheckCircle className="text-[#DDA853] text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-[#DDA853]">Daily Attendance</h3>
                  <p className="text-[#16404D] mt-1">View today's records</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/reports">
            <div className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-[#7AE2CF]/10 group-hover:bg-[#7AE2CF]/20 transition-colors duration-300">
                  <FiAward className="text-[#7AE2CF] text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-[#06202B]">Reports</h3>
                  <p className="text-[#16404D] mt-1">View performance data</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;