'use client'
import React, { useState } from 'react';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiTrendingUp, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample data - in a real app, this would come from an API
  const attendanceData = {
    monthly: [
      { date: '2023-11-01', status: 'present', timeIn: '08:45', timeOut: '17:30' },
      { date: '2023-11-02', status: 'present', timeIn: '09:00', timeOut: '17:45' },
      { date: '2023-11-03', status: 'absent', timeIn: null, timeOut: null },
      { date: '2023-11-06', status: 'present', timeIn: '08:30', timeOut: '17:15' },
      { date: '2023-11-07', status: 'late', timeIn: '10:15', timeOut: '18:00' },
      { date: '2023-11-08', status: 'present', timeIn: '09:05', timeOut: '17:50' },
      { date: '2023-11-09', status: 'present', timeIn: '08:55', timeOut: '17:20' },
      { date: '2023-11-10', status: 'half-day', timeIn: '09:00', timeOut: '13:00' },
    ],
    pastMonths: [
      { month: 'October 2023', present: 18, absent: 2, late: 3, halfDays: 2 },
      { month: 'September 2023', present: 20, absent: 0, late: 1, halfDays: 1 },
      { month: 'August 2023', present: 19, absent: 1, late: 2, halfDays: 0 },
    ]
  };

  // Chart data
  const monthlyChartData = {
    labels: attendanceData.monthly.map(day => new Date(day.date).getDate()),
    datasets: [
      {
        label: 'Working Hours',
        data: attendanceData.monthly.map(day => {
          if (!day.timeIn || !day.timeOut) return 0;
          const [inH, inM] = day.timeIn.split(':').map(Number);
          const [outH, outM] = day.timeOut.split(':').map(Number);
          return (outH + outM/60) - (inH + inM/60);
        }),
        backgroundColor: '#077A7D',
        borderColor: '#16404D',
        borderWidth: 1,
      }
    ]
  };

  const pastMonthsChartData = {
    labels: attendanceData.pastMonths.map(month => month.month.split(' ')[0]),
    datasets: [
      {
        label: 'Present Days',
        data: attendanceData.pastMonths.map(month => month.present),
        backgroundColor: '#077A7D',
        borderColor: '#16404D',
        borderWidth: 2,
        tension: 0.1,
        fill: true
      },
      {
        label: 'Late Days',
        data: attendanceData.pastMonths.map(month => month.late),
        backgroundColor: '#DDA853',
        borderColor: '#16404D',
        borderWidth: 2,
        tension: 0.1
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
      present: 'bg-[#7AE2CF] text-[#16404D]',
      absent: 'bg-[#F5EEDD] text-[#DDA853] border border-[#DDA853]',
      late: 'bg-[#DDA853]/20 text-[#DDA853]',
      'half-day': 'bg-[#A6CDC6] text-[#16404D]'
    };
    return styles[status] || '';
  };

  const getStatusIcon = (status) => {
    const icons = {
      present: <FiCheckCircle className="mr-1" />,
      absent: <FiXCircle className="mr-1" />,
      late: <FiClock className="mr-1" />,
      'half-day': <FiTrendingUp className="mr-1" />
    };
    return icons[status] || null;
  };

  const calculateHours = (timeIn, timeOut) => {
    if (!timeIn || !timeOut) return '-';
    const [inH, inM] = timeIn.split(':').map(Number);
    const [outH, outM] = timeOut.split(':').map(Number);
    return ((outH + outM/60) - (inH + inM/60)).toFixed(1) + 'h';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06202B] to-[#16404D] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#F5EEDD] mb-1">Attendance History</h1>
          <p className="text-sm md:text-base text-[#A6CDC6]">Track your attendance records and patterns</p>
        </div>

        {/* Main Content */}
        <div className="bg-[#FBF5DD] rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#A6CDC6]">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`flex-1 py-3 text-sm md:text-base font-medium text-center transition-colors ${activeTab === 'monthly' ? 'text-[#077A7D] border-b-2 border-[#077A7D]' : 'text-[#16404D] hover:bg-[#F5EEDD]'}`}
            >
              Monthly View
            </button>
            <button
              onClick={() => setActiveTab('pastMonths')}
              className={`flex-1 py-3 text-sm md:text-base font-medium text-center transition-colors ${activeTab === 'pastMonths' ? 'text-[#077A7D] border-b-2 border-[#077A7D]' : 'text-[#16404D] hover:bg-[#F5EEDD]'}`}
            >
              Past Months
            </button>
          </div>

          {/* Month Selector */}
          <div className="p-3 border-b border-[#A6CDC6] flex items-center justify-between bg-[#F5EEDD]">
            <button 
              className="p-1 md:p-2 rounded-full hover:bg-[#A6CDC6]/30"
              onClick={() => setSelectedMonth(prev => prev > 0 ? prev - 1 : 11)}
            >
              <FiChevronLeft className="text-[#16404D]" />
            </button>
            <div className="flex items-center">
              <FiCalendar className="text-[#077A7D] mr-2" />
              <span className="text-sm md:text-base font-medium text-[#16404D]">
                {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button 
              className="p-1 md:p-2 rounded-full hover:bg-[#A6CDC6]/30"
              onClick={() => setSelectedMonth(prev => prev < 11 ? prev + 1 : 0)}
            >
              <FiChevronRight className="text-[#16404D]" />
            </button>
          </div>

          {/* Content Area */}
          <div className="p-4 md:p-6">
            {activeTab === 'monthly' ? (
              <div className="space-y-6">
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
                    {attendanceData.monthly.map((day, index) => (
                      <div 
                        key={index} 
                        className="bg-white p-3 rounded-lg border border-[#A6CDC6]"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-[#16404D]">
                              {new Date(day.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(day.status)}`}>
                              {getStatusIcon(day.status)}
                              {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-[#077A7D]">
                            {calculateHours(day.timeIn, day.timeOut)}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-[#16404D]/70">Time In</p>
                            <p className="font-medium">{day.timeIn || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[#16404D]/70">Time Out</p>
                            <p className="font-medium">{day.timeOut || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#7AE2CF]/30 text-[#16404D]">
                          <th className="p-2 text-left rounded-tl-lg text-sm">Date</th>
                          <th className="p-2 text-left text-sm">Status</th>
                          <th className="p-2 text-left text-sm">Time In</th>
                          <th className="p-2 text-left text-sm">Time Out</th>
                          <th className="p-2 text-left rounded-tr-lg text-sm">Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.monthly.map((day, index) => (
                          <tr 
                            key={index} 
                            className={`border-b border-[#A6CDC6] ${index % 2 === 0 ? 'bg-[#FBF5DD]' : 'bg-[#F5EEDD]'}`}
                          >
                            <td className="p-2 text-sm">
                              {new Date(day.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </td>
                            <td className="p-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(day.status)}`}>
                                {getStatusIcon(day.status)}
                                {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                              </span>
                            </td>
                            <td className="p-2 text-sm">{day.timeIn || '-'}</td>
                            <td className="p-2 text-sm">{day.timeOut || '-'}</td>
                            <td className="p-2 text-sm font-medium">
                              {calculateHours(day.timeIn, day.timeOut)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Past Months Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {attendanceData.pastMonths.map((month, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-[#A6CDC6]">
                      <h3 className="text-base font-semibold text-[#16404D] mb-2">{month.month}</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#077A7D]">Present:</span>
                          <span className="font-medium">{month.present} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#DDA853]">Late:</span>
                          <span className="font-medium">{month.late} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#A6CDC6]">Half Days:</span>
                          <span className="font-medium">{month.halfDays} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#16404D]">Absent:</span>
                          <span className="font-medium">{month.absent} days</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trend Chart */}
                <div className="bg-white p-3 rounded-lg border border-[#A6CDC6]">
                  <h3 className="text-base md:text-lg font-semibold text-[#16404D] mb-3 flex items-center">
                    <FiTrendingUp className="mr-2 text-[#077A7D]" />
                    Attendance Trends
                  </h3>
                  <div className="h-48 md:h-56">
                    <Line data={pastMonthsChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary Footer */}
          <div className="bg-[#F5EEDD] p-3 border-t border-[#A6CDC6] flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center">
              <FiFilter className="text-[#077A7D] mr-2" />
              <span className="text-xs md:text-sm text-[#16404D]">
                Showing data for {activeTab === 'monthly' ? 'this month' : 'past 3 months'}
              </span>
            </div>
            <div className="flex gap-3">
              <div className="text-center min-w-[60px]">
                <div className="text-xs text-[#077A7D]">Present</div>
                <div className="text-sm font-bold text-[#16404D]">
                  {activeTab === 'monthly' 
                    ? attendanceData.monthly.filter(d => d.status === 'present').length
                    : attendanceData.pastMonths.reduce((sum, month) => sum + month.present, 0)
                  }
                </div>
              </div>
              <div className="text-center min-w-[60px]">
                <div className="text-xs text-[#DDA853]">Late</div>
                <div className="text-sm font-bold text-[#16404D]">
                  {activeTab === 'monthly' 
                    ? attendanceData.monthly.filter(d => d.status === 'late').length
                    : attendanceData.pastMonths.reduce((sum, month) => sum + month.late, 0)
                  }
                </div>
              </div>
              <div className="text-center min-w-[60px]">
                <div className="text-xs text-[#16404D]">Absent</div>
                <div className="text-sm font-bold text-[#16404D]">
                  {activeTab === 'monthly' 
                    ? attendanceData.monthly.filter(d => d.status === 'absent').length
                    : attendanceData.pastMonths.reduce((sum, month) => sum + month.absent, 0)
                  }
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