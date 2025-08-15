'use client'
import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiTrendingUp, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { auth } from '@/app/lib/auth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HistoryPage = () => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [userId, setUserId] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({
    monthLabel: '',
    totalDays: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalEarlyLeave: 0,
    averageWorkHours: 0,
    records: []
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await auth();
        if (userData === 'No Token') {
          router.push('/login');
        } else {
          setUserId(userData._id);
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
    if (!userId || !businessId) return;

    const fetchAttendanceByMonth = async (month, year) => {
      try {
        setIsLoading(true);

        const monthParam = `${year}-${String(month).padStart(2, '0')}`;

        const url = new URL('/api/employee/attendance/history', window.location.origin);
        url.searchParams.append('employeeId', userId);
        url.searchParams.append('businessId', businessId);
        url.searchParams.append('month', monthParam);

        const response = await fetch(url);
        const data = await response.json();

        if (!data.success) throw new Error(data.msg || 'Failed to fetch attendance data');

        setAttendanceData(data.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceByMonth(selectedMonth + 1, selectedYear);
  }, [userId, businessId, selectedMonth, selectedYear]);

  const getDayStatus = (record) => {
    if (record.inStatus === 'Absent' && record.outStatus === 'Absent') {
      return 'Absent';
    }
    if (record.inStatus === 'Leave' || record.outStatus === 'Leave') {
      return 'Leave';
    }
    if (record.inStatus === 'Half-Day' || record.outStatus === 'Half-Day') {
      return 'Half-Day';
    }
    if (record.inStatus === 'Late') {
      return 'Late';
    }
    if (record.outStatus === 'Early Leave') {
      return 'Early Leave';
    }
    return 'Present';
  };

  const monthlyChartData = {
    labels: attendanceData.records.map(record => 
      new Date(record.date).getDate()
    ),
    datasets: [
      {
        label: 'Working Hours',
        data: attendanceData.records.map(record => record.workHours),
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
          font: {
            family: 'sans-serif'
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#16404D'
        },
        grid: {
          color: '#A6CDC6'
        }
      },
      x: {
        ticks: {
          color: '#16404D'
        },
        grid: {
          color: '#A6CDC6'
        }
      }
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
    return styles[status] || '';
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

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#06202B] to-[#16404D] flex items-center justify-center">
        <div className="text-white">Loading attendance data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06202B] to-[#16404D] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#F5EEDD] mb-1">Attendance History</h1>
          <p className="text-sm md:text-base text-[#A6CDC6]">Track your monthly attendance records</p>
        </div>

        {/* Main Content */}
        <div className="bg-[#FBF5DD] rounded-xl shadow-lg overflow-hidden">
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
                {attendanceData.monthLabel || 
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
                    {attendanceData.totalPresent}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#A6CDC6] text-center">
                  <div className="text-xs text-[#DDA853]">Late</div>
                  <div className="text-xl font-bold text-[#16404D]">
                    {attendanceData.totalLate}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#A6CDC6] text-center">
                  <div className="text-xs text-[#16404D]">Absent</div>
                  <div className="text-xl font-bold text-[#16404D]">
                    {attendanceData.totalAbsent}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#A6CDC6] text-center">
                  <div className="text-xs text-[#077A7D]">Avg. Hours</div>
                  <div className="text-xl font-bold text-[#16404D]">
                    {attendanceData.averageWorkHours.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Chart - Only show on larger screens */}
              <div className="hidden md:block bg-white p-3 rounded-lg border border-[#A6CDC6]">
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
                  {attendanceData.records.map((record, index) => {
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
                      {attendanceData.records.map((record, index) => {
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

          {/* Summary Footer */}
          <div className="bg-[#F5EEDD] p-3 border-t border-[#A6CDC6] flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center">
              <FiCalendar className="text-[#077A7D] mr-2" />
              <span className="text-xs md:text-sm text-[#16404D]">
                Showing data for {attendanceData.monthLabel}
              </span>
            </div>
            <div className="flex gap-3">
              <div className="text-center min-w-[60px]">
                <div className="text-xs text-[#077A7D]">Present</div>
                <div className="text-sm font-bold text-[#16404D]">
                  {attendanceData.totalPresent}
                </div>
              </div>
              <div className="text-center min-w-[60px]">
                <div className="text-xs text-[#DDA853]">Late</div>
                <div className="text-sm font-bold text-[#16404D]">
                  {attendanceData.totalLate}
                </div>
              </div>
              <div className="text-center min-w-[60px]">
                <div className="text-xs text-[#16404D]">Absent</div>
                <div className="text-sm font-bold text-[#16404D]">
                  {attendanceData.totalAbsent}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;