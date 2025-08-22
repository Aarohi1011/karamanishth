'use client'
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { auth } from '@/app/lib/auth';

const COLORS = {
  primaryDark: '#06202B',
  primary: '#077A7D',
  primaryLight: '#7AE2CF',
  background: '#F5EEDD',
  accent: '#DDA853',
  secondaryDark: '#16404D',
  secondaryLight: '#A6CDC6',
  lightBackground: '#FBF5DD',
};

const MonthSelector = ({ selectedDate, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
      <div className="w-full sm:w-auto">
        <DatePicker
          selected={selectedDate}
          onChange={onChange}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
        />
      </div>
      <button
        onClick={() => onChange(new Date())}
        className="px-4 py-2 bg-[#DDA853] text-white rounded-md hover:bg-[#c09548] transition-colors w-full sm:w-auto"
      >
        Current Month
      </button>
    </div>
  );
};

const SummaryCards = ({ summary, workingDays, holidays }) => {
  const cards = [
    {
      title: 'Working Days',
      value: workingDays,
      color: COLORS.primary,
      icon: '📅',
    },
    {
      title: 'Holidays',
      value: holidays,
      color: COLORS.accent,
      icon: '🎉',
    },
    {
      title: 'Present',
      value: summary.totalPresent,
      color: COLORS.primaryLight,
      icon: '✅',
    },
    {
      title: 'Absent',
      value: summary.totalAbsent,
      color: COLORS.secondaryDark,
      icon: '❌',
    },
    {
      title: 'Late Arrivals',
      value: summary.totalLate,
      color: COLORS.secondaryLight,
      icon: '⏰',
    },
    {
      title: 'Half Days',
      value: summary.totalHalfDay,
      color: COLORS.primaryDark,
      icon: '½',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm p-3 border-l-4"
          style={{ borderLeftColor: card.color }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">{card.icon}</span>
            <h3 className="text-xs font-medium text-gray-500 text-right">{card.title}</h3>
          </div>
          <p className="text-xl font-bold text-center" style={{ color: card.color }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

const AttendanceTrendChart = ({ dailyStats }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = dailyStats.map(day => ({
    date: new Date(day.date).getDate(),
    present: day.present,
    absent: day.absent,
    late: day.late,
    halfDay: day.halfDay,
    isHoliday: day.isHoliday,
  }));

  // Custom tooltip for better mobile experience
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-semibold text-sm">Day {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primaryDark }}>
        Daily Attendance Trend
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={isMobile ? { top: 20, right: 5, left: 5, bottom: 20 } : { top: 20, right: 20, left: 20, bottom: 20 }}
            barSize={isMobile ? 12 : 20}
            barGap={isMobile ? 2 : 4}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: isMobile ? 10 : 11, fill: '#666' }}
              interval={isMobile ? 2 : 0}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 10 : 11, fill: '#666' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                fontSize: isMobile ? 10 : 11,
                paddingTop: isMobile ? 10 : 0
              }}
              layout={isMobile ? 'horizontal' : 'horizontal'}
              verticalAlign="bottom"
              height={isMobile ? 40 : 36}
            />
            <Bar 
              dataKey="present" 
              fill={COLORS.primaryLight} 
              name="Present" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="absent" 
              fill={COLORS.secondaryDark} 
              name="Absent" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="late" 
              fill={COLORS.secondaryLight} 
              name="Late" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="halfDay" 
              fill={COLORS.primaryDark} 
              name="Half Day" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {isMobile && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Scroll horizontally to view all days
        </p>
      )}
    </div>
  );
};

const StatusDistributionChart = ({ summary, totalEmployees, workingDays }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPossible = workingDays * totalEmployees;
  const presentPercentage = (summary.totalPresent / totalPossible) * 100;
  const latePercentage = (summary.totalLate / totalPossible) * 100;
  const halfDayPercentage = (summary.totalHalfDay * 0.5 / totalPossible) * 100;
  const absentPercentage = (summary.totalAbsent / totalPossible) * 100;

  const data = [
    { name: 'Present', value: presentPercentage, color: COLORS.primaryLight },
    { name: 'Late', value: latePercentage, color: COLORS.secondaryLight },
    { name: 'Half Day', value: halfDayPercentage, color: COLORS.primaryDark },
    { name: 'Absent', value: absentPercentage, color: COLORS.secondaryDark },
  ];

  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={isMobile ? 10 : 11}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primaryDark }}>
        Attendance Distribution
      </h3>
      <div className="h-96 flex flex-col">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 80 : 90}
                innerRadius={isMobile ? 50 : 60}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value.toFixed(1)}%`, 'Percentage']}
                contentStyle={{ 
                  fontSize: isMobile ? 12 : 14,
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3 mt-4`}>
          {data.map((item, index) => (
            <div key={index} className="flex items-center text-xs">
              <div 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="truncate">{item.name}</span>
              <span className="ml-1 font-semibold">({item.value.toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EmployeePerformanceTable = ({ employeeStats }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'present', direction: 'descending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  const sortedEmployees = Object.entries(employeeStats)
    .map(([id, stats]) => ({ id, ...stats }))
    .filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getAttendancePercentage = (emp) => {
    if (emp.totalDays === 0) return 0;
    const score = emp.present + emp.late * 0.8 + emp.halfDay * 0.5;
    return (score / emp.totalDays) * 100;
  };

  // Mobile Card View
  const MobileEmployeeCard = ({ emp }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3 border-l-4" style={{ borderLeftColor: COLORS.primary }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-[#06202B]">{emp.name}</h4>
          <p className="text-sm text-gray-500">{emp.role}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">Attendance</div>
          <div className="text-lg font-bold" style={{ color: getAttendancePercentage(emp) > 90 ? COLORS.primaryLight : getAttendancePercentage(emp) > 70 ? COLORS.accent : COLORS.secondaryDark }}>
            {getAttendancePercentage(emp).toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.primaryLight }}></span>
          <span>Present: {emp.present}</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.secondaryDark }}></span>
          <span>Absent: {emp.absent}</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.secondaryLight }}></span>
          <span>Late: {emp.late}</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.primaryDark }}></span>
          <span>Half Day: {emp.halfDay}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Total Days: {emp.totalDays}</span>
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full" 
              style={{
                width: `${getAttendancePercentage(emp)}%`,
                backgroundColor: getAttendancePercentage(emp) > 90 
                  ? COLORS.primaryLight 
                  : getAttendancePercentage(emp) > 70 
                    ? COLORS.accent 
                    : COLORS.secondaryDark
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primaryDark }}>
        Employee Performance
      </h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isMobile ? (
        <div className="space-y-3">
          {sortedEmployees.map((emp) => (
            <MobileEmployeeCard key={emp.id} emp={emp} />
          ))}
          {sortedEmployees.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No employees found matching your search
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  Employee
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('role')}
                >
                  Role
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('present')}
                >
                  Present
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('absent')}
                >
                  Absent
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('late')}
                >
                  Late
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('halfDay')}
                >
                  Half Day
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('totalDays')}
                >
                  Total Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Attendance %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{emp.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {emp.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: COLORS.primaryLight }}>
                    {emp.present}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: COLORS.secondaryDark }}>
                    {emp.absent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: COLORS.secondaryLight }}>
                    {emp.late}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: COLORS.primaryDark }}>
                    {emp.halfDay}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {emp.totalDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{
                          width: `${getAttendancePercentage(emp)}%`,
                          backgroundColor: getAttendancePercentage(emp) > 90 
                            ? COLORS.primaryLight 
                            : getAttendancePercentage(emp) > 70 
                              ? COLORS.accent 
                              : COLORS.secondaryDark
                        }}
                      ></div>
                    </div>
                    <span className="text-sm ml-2">{getAttendancePercentage(emp).toFixed(1)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const HolidayCalendar = ({ dailyStats }) => {
  const holidays = dailyStats.filter(day => day.isHoliday);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primaryDark }}>
        Holidays This Month
      </h3>
      {holidays.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {holidays.map((holiday, index) => (
            <div 
              key={index} 
              className="border-l-4 pl-3 py-2 bg-gray-50 rounded-r"
              style={{ borderLeftColor: COLORS.accent }}
            >
              <h4 className="font-medium text-sm" style={{ color: COLORS.primary }}>
                {new Date(holiday.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </h4>
              <p className="text-xs text-gray-600 mt-1">{holiday.holidayName}</p>
              <p className="text-xs text-gray-400">
                {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No holidays this month</p>
      )}
    </div>
  );
};

export default function MonthlyAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async (year, month) => {
    try {
      setLoading(true);
      const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
      const userData = await auth();
      const businessId = userData.businessId;
      
      const response = await fetch(
        `/api/business/attendance/analysis?businessId=${businessId}&month=${monthStr}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    fetchData(year, month);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.lightBackground }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto" style={{ borderColor: COLORS.primary }}></div>
          <p className="mt-4" style={{ color: COLORS.primaryDark }}>Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.lightBackground }}>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.secondaryDark }}>Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md text-white" 
            style={{ backgroundColor: COLORS.primary }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.lightBackground }}>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.secondaryDark }}>No Data Available</h2>
          <p className="text-gray-600">Please select a different month or check your business ID</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: COLORS.lightBackground }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLORS.primaryDark }}>
              Monthly Attendance
            </h1>
            <p className="text-gray-600">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <MonthSelector selectedDate={selectedDate} onChange={handleDateChange} />
        </div>

        <SummaryCards 
          summary={data.summary} 
          workingDays={data.workingDays} 
          holidays={data.holidays} 
        />

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="w-full lg:w-1/2">
            <AttendanceTrendChart dailyStats={data.dailyStats} />
          </div>
          <div className="w-full lg:w-1/2">
            <StatusDistributionChart 
              summary={data.summary} 
              totalEmployees={data.totalEmployees} 
              workingDays={data.workingDays} 
            />
          </div>
        </div>

        <HolidayCalendar dailyStats={data.dailyStats} />

        <EmployeePerformanceTable employeeStats={data.employeeStats} />
      </div>
    </div>
  );
}