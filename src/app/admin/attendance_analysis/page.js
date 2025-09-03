'use client'
import { useState, useEffect, useCallback } from 'react';
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

// Enhanced tooltip with gradient background
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 p-4 border border-gray-200 rounded-lg shadow-xl backdrop-blur-sm">
        {label && <p className="font-bold text-sm mb-2 text-[#06202B]">Day {label}</p>}
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <p className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.name}: <span className="font-bold">{entry.value}</span>
              </p>
            </div>
          ))}
        </div>
        {payload[0]?.payload?.isHoliday && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-yellow-600 flex items-center">
              <span className="mr-1">🎉</span> 
              {payload[0].payload.holidayName}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Custom legend for charts
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center">
          <div 
            className="w-4 h-4 rounded-sm mr-2" 
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-sm font-medium text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Enhanced Radial Progress component with animation
const RadialProgress = ({ value, max, color, icon, percentage, animationDelay = 0 }) => {
  const circumference = 2 * Math.PI * 40;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-gray-100"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          {/* Progress circle with animation */}
          <circle
            className="transition-all duration-1000 ease-out"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
            style={{
              transitionDelay: `${animationDelay}ms`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{value}</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
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
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#077A7D] w-full sm:w-48 shadow-sm"
        />
      </div>
      <button
        onClick={() => onChange(new Date())}
        className="px-4 py-3 bg-gradient-to-r from-[#DDA853] to-[#c09548] text-white rounded-lg hover:shadow-md transition-all w-full sm:w-auto font-medium"
      >
        Current Month
      </button>
    </div>
  );
};

const SummaryCards = ({ summary, workingDays, holidays, totalDays }) => {
  const [animatedValues, setAnimatedValues] = useState({
    workingDays: 0,
    holidays: 0,
    workingDaysPercentage: 0,
    holidaysPercentage: 0
  });

  useEffect(() => {
    // Animate the values when component mounts or values change
    const workingDaysPercentage = totalDays > 0 ? (workingDays / totalDays) * 100 : 0;
    const holidaysPercentage = totalDays > 0 ? (holidays / totalDays) * 100 : 0;
    
    const timer = setTimeout(() => {
      setAnimatedValues({
        workingDays,
        holidays,
        workingDaysPercentage,
        holidaysPercentage
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [workingDays, holidays, totalDays]);

  // Enhanced cards with more information
  const cards = [
    {
      title: 'Working Days',
      value: animatedValues.workingDays,
      percentage: animatedValues.workingDaysPercentage,
      color: COLORS.primary,
      icon: '📅',
      description: 'Days employees are expected to work',
      trend: '+2% from last month',
      max: totalDays || 31
    },
    {
      title: 'Holidays',
      value: animatedValues.holidays,
      percentage: animatedValues.holidaysPercentage,
      color: COLORS.accent,
      icon: '🎉',
      description: 'Official holidays this month',
      trend: '1 more than last month',
      max: totalDays || 31
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl"
        >
          <div 
            className="h-2 w-full" 
            style={{ backgroundColor: card.color }}
          ></div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{card.description}</p>
              </div>
              <span className="text-4xl">{card.icon}</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-shrink-0">
                <RadialProgress 
                  value={card.value} 
                  max={card.max} 
                  color={card.color}
                  icon={card.icon}
                  percentage={card.percentage}
                  animationDelay={index * 200}
                />
              </div>
              
              <div className="flex-1">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Percentage of month</span>
                      <span className="text-lg font-bold" style={{ color: card.color }}>
                        {card.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                        style={{ 
                          width: `${card.percentage}%`,
                          backgroundColor: card.color,
                          transitionDelay: `${index * 200}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="mr-2">📈</span>
                      {card.trend}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
                      <p className="text-xs text-gray-500">Count</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-700">{card.max}</p>
                      <p className="text-xs text-gray-500">Total Days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

  // Ensure we have valid data
  const data = dailyStats && dailyStats.length > 0 
    ? dailyStats.map(day => ({
        date: new Date(day.date).getDate(),
        present: day.present || 0,
        absent: day.absent || 0,
        late: day.late || 0,
        halfDay: day.halfDay || 0,
        isHoliday: day.isHoliday || false,
        holidayName: day.holidayName || '',
      }))
    : [];

  // If no data, show a message
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 h-96 flex flex-col items-center justify-center">
        <div className="text-5xl mb-4">📊</div>
        <p className="text-gray-500 text-lg">No attendance data available for this month</p>
        <p className="text-gray-400 text-sm mt-2">Select a different month to view data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-xl font-semibold mb-2 sm:mb-0" style={{ color: COLORS.primaryDark }}>
          Daily Attendance Trend
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.primaryLight }}></div>
          <span className="text-sm text-gray-600">Present</span>
          <div className="w-3 h-3 rounded-sm ml-2" style={{ backgroundColor: COLORS.secondaryDark }}></div>
          <span className="text-sm text-gray-600">Absent</span>
        </div>
      </div>
      <div className="h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={isMobile ? { top: 20, right: 5, left: 5, bottom: 20 } : { top: 20, right: 20, left: 20, bottom: 20 }}
            barSize={isMobile ? 12 : 20}
            barGap={isMobile ? 2 : 4}
          >
            <defs>
              <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.primaryLight} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={COLORS.primaryLight} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.secondaryDark} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={COLORS.secondaryDark} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.secondaryLight} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={COLORS.secondaryLight} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorHalfDay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.primaryDark} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={COLORS.primaryDark} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
              interval={isMobile ? 2 : 0}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="present" 
              fill="url(#colorPresent)" 
              name="Present" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="absent" 
              fill="url(#colorAbsent)" 
              name="Absent" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="late" 
              fill="url(#colorLate)" 
              name="Late" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="halfDay" 
              fill="url(#colorHalfDay)" 
              name="Half Day" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {isMobile && (
        <p className="text-xs text-gray-500 text-center mt-4">
          Scroll horizontally to view all days
        </p>
      )}
    </div>
  );
};

const EmployeePerformanceTable = ({ employeeStats }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'present', direction: 'descending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  const sortedEmployees = employeeStats && Object.entries(employeeStats)
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
    }) || [];

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
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3 border-l-4" style={{ borderLeftColor: COLORS.primary }}>
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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.primaryDark }}>
        Employee Performance
      </h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#077A7D]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {sortedEmployees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">👥</div>
          <p>No employee data available</p>
        </div>
      ) : isMobile ? (
        <div className="space-y-3">
          {sortedEmployees.map((emp) => (
            <MobileEmployeeCard key={emp.id} emp={emp} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('name')}
                >
                  Employee
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('role')}
                >
                  Role
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('present')}
                >
                  Present
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('absent')}
                >
                  Absent
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('late')}
                >
                  Late
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('halfDay')}
                >
                  Half Day
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('totalDays')}
                >
                  Total Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
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
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
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
                      <span className="text-sm">{getAttendancePercentage(emp).toFixed(1)}%</span>
                    </div>
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
  const holidays = dailyStats ? dailyStats.filter(day => day.isHoliday) : [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.primaryDark }}>
        Holidays This Month
      </h3>
      {holidays.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {holidays.map((holiday, index) => (
            <div 
              key={index} 
              className="border-l-4 pl-4 py-3 bg-gradient-to-r from-gray-50 to-white rounded-r-lg shadow-sm"
              style={{ borderLeftColor: COLORS.accent }}
            >
              <h4 className="font-medium text-sm" style={{ color: COLORS.primary }}>
                {new Date(holiday.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </h4>
              <p className="text-xs text-gray-600 mt-1">{holiday.holidayName}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            </div>
          ))}
        </div>
       ):(
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🎉</div>
          <p>No holidays this month</p>
        </div>
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

  const fetchData = useCallback(async (year, month) => {
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
  }, []);

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    fetchData(year, month);
  }, [selectedDate, fetchData]);

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
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.secondaryDark }}>Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-white font-medium" 
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
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.secondaryDark }}>No Data Available</h2>
      <p className="text-gray-600">Please select a different month or check your business ID</p>
        </div>
      </div>
    );
  }

  // Calculate total days in the selected month
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: COLORS.lightBackground }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-8">
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
          summary={data.summary || {}} 
          workingDays={data.workingDays || 0} 
          holidays={data.holidays || 0} 
          totalDays={totalDays}
        />

        <div className="mb-8">
          <AttendanceTrendChart dailyStats={data.dailyStats || []} />
        </div>

        <HolidayCalendar dailyStats={data.dailyStats || []} />

        <EmployeePerformanceTable employeeStats={data.employeeStats || {}} />
      </div>
    </div>
  );
}