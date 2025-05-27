'use client'
import React, { useState } from 'react'
import { FiDownload, FiFilter, FiSearch, FiChevronDown, FiChevronUp, FiCheckCircle, FiXCircle, FiClock, FiArrowLeft } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

const DailyAttendancePage = () => {
  const router = useRouter()
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Sample employee data
  const employees = [
    { id: 1, name: 'John Doe', department: 'Development', position: 'Senior Developer', status: 'present', checkIn: '08:45 AM', checkOut: '05:30 PM' },
    { id: 2, name: 'Jane Smith', department: 'Design', position: 'UI/UX Designer', status: 'present', checkIn: '09:15 AM', checkOut: '06:00 PM' },
    { id: 3, name: 'Robert Johnson', department: 'Marketing', position: 'Marketing Manager', status: 'absent', checkIn: '--', checkOut: '--' },
    { id: 4, name: 'Emily Davis', department: 'Development', position: 'Frontend Developer', status: 'late', checkIn: '10:30 AM', checkOut: '07:00 PM' },
    { id: 5, name: 'Michael Wilson', department: 'HR', position: 'HR Manager', status: 'present', checkIn: '08:55 AM', checkOut: '05:45 PM' },
    { id: 6, name: 'Sarah Brown', department: 'Sales', position: 'Sales Executive', status: 'on leave', checkIn: '--', checkOut: '--' },
    { id: 7, name: 'David Miller', department: 'Development', position: 'Backend Developer', status: 'present', checkIn: '09:05 AM', checkOut: '06:15 PM' },
    { id: 8, name: 'Jessica Lee', department: 'Design', position: 'Graphic Designer', status: 'absent', checkIn: '--', checkOut: '--' },
  ]

  // Sorting function
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Apply sorting
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

  // Apply search and filter
  const filteredEmployees = sortedEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Status badge component
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

  // Download attendance as CSV
  const downloadCSV = () => {
    const headers = ['ID', 'Name', 'Department', 'Position', 'Status', 'Check In', 'Check Out']
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => 
        [emp.id, emp.name, emp.department, emp.position, emp.status, emp.checkIn, emp.checkOut].join(',')
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

  return (
    <div className="min-h-screen bg-[#F5EEDD] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <button 
              onClick={() => router.push('/admin')}
              className="mr-4 p-2 rounded-full hover:bg-[#FBF5DD] transition-colors"
            >
              <FiArrowLeft className="text-[#16404D] text-xl" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-[#06202B]">Daily Attendance</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-[#16404D]" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 pr-4 py-2 w-full border border-[#A6CDC6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#077A7D] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 border border-[#A6CDC6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#077A7D] focus:border-transparent bg-white"
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
              className="flex items-center justify-center gap-2 bg-[#077A7D] hover:bg-[#16404D] text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FiDownload /> Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#A6CDC6]">
              <thead className="bg-[#FBF5DD]">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('id')}
                  >
                    <div className="flex items-center">
                      ID
                      {sortConfig.key === 'id' && (
                        sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
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
                    className="px-6 py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
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
                    className="px-6 py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
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
                    className="px-6 py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
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
                    className="px-6 py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
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
                    className="px-6 py-3 text-left text-xs font-medium text-[#16404D] uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('checkOut')}
                  >
                    <div className="flex items-center">
                      Check Out
                      {sortConfig.key === 'checkOut' && (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#06202B]">{employee.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#06202B]">{employee.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#16404D]">{employee.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#16404D]">{employee.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#16404D]">
                        <StatusBadge status={employee.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#16404D]">{employee.checkIn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#16404D]">{employee.checkOut}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-[#16404D]">
                      No employees found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-[#16404D]">
          <div className="mb-2 sm:mb-0">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEmployees.length}</span> of{' '}
            <span className="font-medium">{employees.length}</span> employees
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-[#A6CDC6] rounded-md hover:bg-[#FBF5DD] disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-[#A6CDC6] rounded-md hover:bg-[#FBF5DD] disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyAttendancePage