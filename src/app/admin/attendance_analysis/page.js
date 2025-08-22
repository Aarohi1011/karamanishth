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

// Enhanced pie chart tooltip
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 p-4 border border-gray-200 rounded-lg shadow-xl">
        <div className="flex items-center mb-2">
          <div 
            className="w-4 h-4 rounded-full mr-2" 
            style={{ backgroundColor: data.color }}
          ></div>
          <p className="font-bold" style={{ color: data.color }}>
            {data.name}
          </p>
        </div>
        <p className="text-sm text-gray-600 mb-2">{data.description}</p>
        <p className="text-sm font-semibold">
          <span className="text-lg" style={{ color: data.color }}>
            {data.value.toFixed(1)}%
          </span>
          <span className="text-gray-500 ml-2">({data.count} employees)</span>
        </p>
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

// Radial progress component for individual metrics
const RadialProgress = ({ value, max, color, label, icon }) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 40;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className="transition-all duration-500 ease-in-out"
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
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{value}</span>
          <span className="text-xs text-gray-500">{label}</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-2xl">{icon}</span>
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

const SummaryCards = ({ summary, workingDays, holidays }) => {
  const cards = [
    {
      title: 'Working Days',
      value: workingDays,
      color: COLORS.primary,
      icon: '📅',
      max: 31
    },
    {
      title: 'Holidays',
      value: holidays,
      color: COLORS.accent,
      icon: '🎉',
      max: 10
    },
    {
      title: 'Present',
      value: summary.totalPresent,
      color: COLORS.primaryLight,
      icon: '✅',
      max: workingDays * 50 // Assuming max 50 employees
    },
    {
      title: 'Absent',
      value: summary.totalAbsent,
      color: COLORS.secondaryDark,
      icon: '❌',
      max: workingDays * 50
    },
    {
      title: 'Late Arrivals',
      value: summary.totalLate,
      color: COLORS.secondaryLight,
      icon: '⏰',
      max: workingDays * 50
    },
    {
      title: 'Half Days',
      value: summary.totalHalfDay,
      color: COLORS.primaryDark,
      icon: '½',
      max: workingDays * 50
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-4 border-l-4 flex flex-col"
          style={{ borderLeftColor: card.color }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg">{card.icon}</span>
            <h3 className="text-xs font-medium text-gray-500 text-right">{card.title}</h3>
          </div>
          <div className="mt-2 flex justify-center">
            <RadialProgress 
              value={card.value} 
              max={card.max} 
              color={card.color}
              label={card.title}
              icon={card.icon}
            />
          </div>
          <p className="text-center text-xl font-bold mt-2" style={{ color: card.color }}>
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

const StatusDistributionChart = ({ summary, totalEmployees, workingDays }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate percentages safely
  const totalPossible = workingDays * (totalEmployees || 1);
  const presentPercentage = ((summary?.totalPresent || 0) / totalPossible) * 100;
  const latePercentage = ((summary?.totalLate || 0) / totalPossible) * 100;
  const halfDayPercentage = (((summary?.totalHalfDay || 0) * 0.5) / totalPossible) * 100;
  const absentPercentage = ((summary?.totalAbsent || 0) / totalPossible) * 100;

  const data = [
    { 
      name: 'Present', 
      value: presentPercentage, 
      color: COLORS.primaryLight,
      count: summary?.totalPresent || 0,
      description: 'Employees present on time'
    },
    { 
      name: 'Late', 
      value: latePercentage, 
      color: COLORS.secondaryLight,
      count: summary?.totalLate || 0,
      description: 'Employees who arrived late'
    },
    { 
      name: 'Half Day', 
      value: halfDayPercentage, 
      color: COLORS.primaryDark,
      count: summary?.totalHalfDay || 0,
      description: 'Employees worked half days'
    },
    { 
      name: 'Absent', 
      value: absentPercentage, 
      color: COLORS.secondaryDark,
      count: summary?.totalAbsent || 0,
      description: 'Employees who were absent'
    },
  ];

  // Calculate overall attendance percentage
  const overallAttendance = ((presentPercentage + latePercentage * 0.8 + halfDayPercentage * 0.5) / 100 * 100).toFixed(1);

  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={isMobile ? 9 : 10}
        fontWeight="bold"
        className="drop-shadow-md"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-xl font-semibold mb-2 sm:mb-0" style={{ color: COLORS.primaryDark }}>
          Attendance Distribution
        </h3>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total: {totalEmployees || 0} employees
        </div>
      </div>

      <div className="h-80 sm:h-96 flex flex-col">
        <div className="flex-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {data.map((entry, index) => (
                  <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.3} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 85 : 100}
                innerRadius={isMobile ? 55 : 70}
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                activeIndex={activeIndex}
                activeShape={(props) => {
                  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
                  return (
                    <g>
                      <path
                        d={`
                          M${cx},${cy}
                          L${cx + outerRadius * Math.cos(-startAngle * Math.PI / 180)},${cy + outerRadius * Math.sin(-startAngle * Math.PI / 180)}
                          A${outerRadius},${outerRadius} 0 ${endAngle - startAngle > 180 ? 1 : 0},1 ${cx + outerRadius * Math.cos(-endAngle * Math.PI / 180)},${cy + outerRadius * Math.sin(-endAngle * Math.PI / 180)}
                          L${cx},${cy}
                        `}
                        fill={fill}
                        opacity={0.9}
                        stroke={fill}
                        strokeWidth={2}
                      />
                      <path
                        d={`
                          M${cx},${cy}
                          L${cx + innerRadius * Math.cos(-startAngle * Math.PI / 180)},${cy + innerRadius * Math.sin(-startAngle * Math.PI / 180)}
                          A${innerRadius},${innerRadius} 0 ${endAngle - startAngle > 180 ? 1 : 0},0 ${cx + innerRadius * Math.cos(-endAngle * Math.PI / 180)},${cy + innerRadius * Math.sin(-endAngle * Math.PI / 180)}
                          L${cx},${cy}
                        `}
                        fill={fill}
                        opacity={0.7}
                      />
                    </g>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#pieGradient${index})`} 
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text with overall attendance percentage */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-3xl font-bold" style={{ color: COLORS.primary }}>
              {overallAttendance}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Overall Attendance</div>
          </div>
        </div>
        
        {/* Enhanced legend with more information */}
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3 mt-6`}>
          {data.map((item, index) => (
            <div 
              key={index} 
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div 
                className="w-4 h-4 rounded-sm mr-3 mt-0.5 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.name}</div>
                <div className="text-xs text-gray-600">{item.value.toFixed(1)}%</div>
                <div className="text-xs text-gray-400 mt-1">{item.count} employees</div>
              </div>
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
        />

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="w-full lg:w-1/2">
            <AttendanceTrendChart dailyStats={data.dailyStats || []} />
          </div>
          <div className="w-full lg:w-1/2">
            <StatusDistributionChart 
              summary={data.summary || {}} 
              totalEmployees={data.totalEmployees || 0} 
              workingDays={data.workingDays || 0} 
            />
          </div>
        </div>

        <HolidayCalendar dailyStats={data.dailyStats || []} />

        <EmployeePerformanceTable employeeStats={data.employeeStats || {}} />
      </div>
    </div>
  );
}