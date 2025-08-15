'use client'
import React, { useState, useEffect } from 'react'
import { FiDownload, FiFilter, FiSearch, FiChevronDown, FiChevronUp, FiCheckCircle, FiXCircle, FiClock, FiArrowLeft } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { auth } from '@/app/lib/auth'

const DailyAttendancePage = () => {
  const router = useRouter()
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [businessId, setBusinessId] = useState(null)
  const [attendanceData, setAttendanceData] = useState(null)
  const [employeeDetails, setEmployeeDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [holidayInfo, setHolidayInfo] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await auth()
        if (userData === 'No Token') {
          router.push('/login')
        } else {
          setBusinessId(userData.businessId)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }
    getUserData()
  }, [router])

  useEffect(() => {
    if (!businessId) return

    const fetchData = async () => {
      try {
        // --- MODIFICATION START ---
        // Fetch both attendance and all employee details concurrently for efficiency
        const [attendanceResponse, employeeDetailsResponse] = await Promise.all([
          fetch(`/api/business/attendance?businessId=${businessId}`),
          fetch('/api/business/getemployee') 
        ]);

        const attendanceJson = await attendanceResponse.json();
        const employeeDetailsJson = await employeeDetailsResponse.json();

        console.log("Attendance API Response:", attendanceJson);
        console.log("Employee Details API Response:", employeeDetailsJson);

        // First, process and store all employee details in a lookup map
        if (employeeDetailsJson.success) {
          const detailsMap = {};
          employeeDetailsJson.data.forEach(emp => {
            detailsMap[emp._id] = {
              name: emp.name,
              role: emp.role,
              department: emp.department || 'Not specified' // Fallback if department is not present
            };
          });
          setEmployeeDetails(detailsMap);
        } else {
          throw new Error(employeeDetailsJson.msg || "Failed to fetch employee details.");
        }
        // --- MODIFICATION END ---
        
        if (!attendanceJson.success) {
          throw new Error(attendanceJson.msg || "Failed to fetch attendance data.");
        }

        if (attendanceJson.isHoliday) {
          setHolidayInfo({
            name: attendanceJson.holidayName,
            description: attendanceJson.holidayDescription
          });
          setLoading(false);
          return;
        }
        
        setAttendanceData(attendanceJson.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData()
  }, [businessId])


  const formatEmployeeData = () => {
    // This function now uses the pre-fetched employeeDetails map
    if (!attendanceData || !attendanceData.employees || Object.keys(employeeDetails).length === 0) return []
    
    return attendanceData.employees.map(emp => {
      const details = employeeDetails[emp.employee] || {
        name: 'Unknown Employee',
        role: 'Not specified',
        department: 'Not specified'
      }

      let status = 'absent'
      if (emp.inStatus) {
        const inStatusLower = emp.inStatus.toLowerCase()
        if (inStatusLower === 'late') {
          status = 'late'
        } else if (inStatusLower === 'present') {
          status = 'present'
        } else if (inStatusLower === 'on leave') {
          status = 'on leave'
        }
      }

      let checkIn = '--'
      let checkOut = '--'
      
      if (status === 'present' || status === 'late') {
        checkIn = emp.inTime ? new Date(emp.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'
        checkOut = emp.outTime ? new Date(emp.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'
      }
      
      return {
        id: emp.employee,
        name: details.name,
        department: details.department,
        position: details.role,
        status,
        checkIn,
        checkOut,
        workHours: emp.workHours || 0
      }
    })
  }

  const employees = formatEmployeeData()

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
    }
    return 0
  })

  const filteredEmployees = sortedEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      'on leave': 'bg-blue-100 text-blue-800'
    }

    const statusIcons = {
      present: <FiCheckCircle className="mr-1" />,
      absent: <FiXCircle className="mr-1" />,
      late: <FiClock className="mr-1" />,
      'on leave': <FiClock className="mr-1" />
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const downloadCSV = () => {
    const headers = ['ID', 'Name', 'Department', 'Position', 'Status', 'Check In', 'Check Out', 'Work Hours']
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => 
        [emp.id, `"${emp.name}"`, `"${emp.department}"`, `"${emp.position}"`, emp.status, emp.checkIn, emp.checkOut, emp.workHours].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `attendance_${new Date().toLocaleDateString()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EEDD] p-4 md:p-6 flex items-center justify-center">
        <div className="text-[#16404D]">Loading attendance data...</div>
      </div>
    )
  }

  if (holidayInfo) {
    return (
      <div className="min-h-screen bg-[#F5EEDD] p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-4 md:mb-6">
            <button 
              onClick={() => router.push('/admin')}
              className="mr-2 md:mr-4 p-1 md:p-2 rounded-full hover:bg-[#FBF5DD] transition-colors"
            >
              <FiArrowLeft className="text-[#16404D] text-lg md:text-xl" />
            </button>
            <h1 className="text-xl md:text-3xl font-bold text-[#06202B]">Daily Attendance</h1>
          </div>
          
          <div className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg p-4 md:p-6 text-center">
            <h2 className="text-lg md:text-xl font-semibold text-[#16404D] mb-2">Today is a holiday!</h2>
            <h3 className="text-md md:text-lg text-[#077A7D] mb-3 md:mb-4">{holidayInfo.name}</h3>
            <p className="text-sm md:text-base text-[#06202B]">{holidayInfo.description}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5EEDD] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
          <div className="flex items-center mb-3 md:mb-0">
            <button 
              onClick={() => router.push('/admin')}
              className="mr-2 md:mr-4 p-1 md:p-2 rounded-full hover:bg-[#FBF5DD] transition-colors"
            >
              <FiArrowLeft className="text-[#16404D] text-lg md:text-xl" />
            </button>
            <h1 className="text-xl md:text-3xl font-bold text-[#06202B]">Daily Attendance</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-[#16404D]" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 pr-4 py-2 w-full border border-[#A6CDC6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#077A7D] focus:border-transparent text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 border border-[#A6CDC6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#077A7D] focus:border-transparent bg-white text-sm md:text-base"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="on leave">On Leave</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiFilter className="text-[#16404D]" />
              </div>
            </div>
            <button
              onClick={downloadCSV}
              className="flex items-center justify-center gap-1 md:gap-2 bg-[#077A7D] hover:bg-[#16404D] text-white px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
            >
              <FiDownload size={16} /> <span>Export</span>
            </button>
          </div>
        </div>

        {attendanceData && attendanceData.employees ? (
          <>
            <div className="mb-4 bg-white rounded-lg p-4 shadow-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Present</p>
                  <p className="text-xl font-bold text-green-800">{attendanceData.totalPresent || 0}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">Absent</p>
                  <p className="text-xl font-bold text-red-800">{attendanceData.totalAbsent || 0}</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-600">Late</p>
                  <p className="text-xl font-bold text-yellow-800">{attendanceData.totalLateArrivals || 0}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Total</p>
                  <p className="text-xl font-bold text-blue-800">{attendanceData.employees.length}</p>
                </div>
              </div>
            </div>

            {isMobile ? (
              // Mobile Card View
              <div className="space-y-3">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <div key={employee.id} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-[#06202B]">{employee.name}</h3>
                          <p className="text-sm text-[#16404D]">{employee.position}</p>
                        </div>
                        <StatusBadge status={employee.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                        <div>
                          <p className="text-gray-500">Department</p>
                          <p className="text-[#16404D]">{employee.department}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">ID</p>
                          <p className="text-[#16404D] truncate">{employee.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Check In</p>
                          <p className="text-[#16404D]">{employee.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Check Out</p>
                          <p className="text-[#16404D]">{employee.checkOut}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Work Hours</p>
                          <p className="text-[#16404D]">{employee.workHours}h</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-4 text-center text-sm text-[#16404D]">
                    No employees found matching your criteria
                  </div>
                )}
              </div>
            ) : (
              // Desktop Table View
              <>
                <div className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#A6CDC6]">
                      <thead className="bg-[#FBF5DD]">
                        <tr>
                          {/* Note: The 'id' column now shows the Employee Name */}
                          <th 
                            scope="col" 
                            className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('name')}
                          >
                            <div className="flex items-center">
                              Name
                              {sortConfig.key === 'name' && (
                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('department')}
                          >
                            <div className="flex items-center">
                              Department
                              {sortConfig.key === 'department' && (
                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('position')}
                          >
                            <div className="flex items-center">
                              Position
                              {sortConfig.key === 'position' && (
                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('status')}
                          >
                            <div className="flex items-center">
                              Status
                              {sortConfig.key === 'status' && (
                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('checkIn')}
                          >
                            <div className="flex items-center">
                              Check In
                              {sortConfig.key === 'checkIn' && (
                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('checkOut')}
                          >
                            <div className="flex items-center">
                              Check Out
                              {sortConfig.key === 'checkOut' && (
                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('workHours')}
                          >
                            <div className="flex items-center">
                              Work Hours
                              {sortConfig.key === 'workHours' && (
                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                              )}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#A6CDC6]">
                        {filteredEmployees.length > 0 ? (
                          filteredEmployees.map((employee) => (
                            <tr key={employee.id} className="hover:bg-[#FBF5DD] transition-colors">
                              <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm font-medium text-[#06202B]">{employee.name}</td>
                              <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-[#16404D]">{employee.department}</td>
                              <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-[#16404D]">{employee.position}</td>
                              <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-[#16404D]">
                                <StatusBadge status={employee.status} />
                              </td>
                              <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-[#16404D]">{employee.checkIn}</td>
                              <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-[#16404D]">{employee.checkOut}</td>
                              <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-[#16404D]">{employee.workHours}h</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="px-4 md:px-6 py-4 text-center text-sm text-[#16404D]">
                              No employees found matching your criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-between items-center text-xs md:text-sm text-[#16404D]">
                  <div className="mb-2 sm:mb-0">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEmployees.length}</span> of{' '}
                    <span className="font-medium">{employees.length}</span> employees
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-2 md:px-3 py-1 border border-[#A6CDC6] rounded-md hover:bg-[#FBF5DD] disabled:opacity-50" disabled>
                      Previous
                    </button>
                    <button className="px-2 md:px-3 py-1 border border-[#A6CDC6] rounded-md hover:bg-[#FBF5DD] disabled:opacity-50" disabled>
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg p-4 md:p-6 text-center">
            <p className="text-[#16404D]">No attendance recorded for today</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyAttendancePage