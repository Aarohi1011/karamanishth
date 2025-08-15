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
    <div className="flex items-center gap-4">
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="MMMM yyyy"
        showMonthYearPicker
        className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-${COLORS.primary}"
      />
      <button
        onClick={() => onChange(new Date())}
        className="px-4 py-2 bg-${COLORS.accent} text-white rounded-md hover:bg-${COLORS.primary} transition-colors"
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
    },
    {
      title: 'Holidays',
      value: holidays,
      color: COLORS.accent,
    },
    {
      title: 'Present',
      value: summary.totalPresent,
      color: COLORS.primaryLight,
    },
    {
      title: 'Absent',
      value: summary.totalAbsent,
      color: COLORS.secondaryDark,
    },
    {
      title: 'Late Arrivals',
      value: summary.totalLate,
      color: COLORS.secondaryLight,
    },
    {
      title: 'Half Days',
      value: summary.totalHalfDay,
      color: COLORS.primaryDark,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-4 border-t-4"
          style={{ borderTopColor: card.color }}
        >
          <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
          <p className="text-2xl font-bold" style={{ color: card.color }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

const AttendanceTrendChart = ({ dailyStats }) => {
  const data = dailyStats.map(day => ({
    date: new Date(day.date).getDate(),
    present: day.present,
    absent: day.absent,
    late: day.late,
    halfDay: day.halfDay,
    isHoliday: day.isHoliday,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primaryDark }}>
        Daily Attendance Trend
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" fill={COLORS.primaryLight} name="Present" />
            <Bar dataKey="absent" fill={COLORS.secondaryDark} name="Absent" />
            <Bar dataKey="late" fill={COLORS.secondaryLight} name="Late" />
            <Bar dataKey="halfDay" fill={COLORS.primaryDark} name="Half Day" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatusDistributionChart = ({ summary, totalEmployees, workingDays }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primaryDark }}>
        Attendance Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Percentage']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const EmployeePerformanceTable = ({ employeeStats }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'present', direction: 'descending' });
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primaryDark }}>
        Employee Performance
      </h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {holidays.map((holiday, index) => (
            <div 
              key={index} 
              className="border-l-4 pl-4 py-2"
              style={{ borderLeftColor: COLORS.accent }}
            >
              <h4 className="font-medium" style={{ color: COLORS.primary }}>
                {new Date(holiday.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </h4>
              <p className="text-gray-600">{holiday.holidayName}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No holidays this month</p>
      )}
    </div>
  );
};

export default function MonthlyAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

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
      console.log(result.data);
      
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.lightBackground }}>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.lightBackground }}>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.secondaryDark }}>No Data Available</h2>
          <p className="text-gray-600">Please select a different month or check your business ID</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.lightBackground }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLORS.primaryDark }}>
              Monthly Attendance Analysis
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <AttendanceTrendChart dailyStats={data.dailyStats} />
          <StatusDistributionChart 
            summary={data.summary} 
            totalEmployees={data.totalEmployees} 
            workingDays={data.workingDays} 
          />
        </div>

        <HolidayCalendar dailyStats={data.dailyStats} />

        <EmployeePerformanceTable employeeStats={data.employeeStats} />
      </div>
    </div>
  );
}