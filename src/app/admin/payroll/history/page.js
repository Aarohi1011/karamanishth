'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { auth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

// Using the same color scheme for a consistent look and feel
const COLORS = {
  primaryDark: '#06202B',
  primary: '#077A7D',
  primaryLight: '#7AE2CF',
  secondaryLight: '#F5EEDD',
  secondary: '#DDA853',
  secondaryDark: '#16404D',
  accentLight: '#A6CDC6',
  accent: '#FBF5DD'
};

export default function PayrollHistory() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ✨ ADDED: Filters are back for searching history
  const [filters, setFilters] = useState({
    employeeId: '',
    month: '',
    year: ''
  });
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    averageSalary: 0
  });

  const router = useRouter();

  // Re-fetch data whenever a filter is changed by the user
  useEffect(() => {
    fetchPayrolls();
    fetchBusinesses();
    fetchEmployees();
  }, [filters]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await auth();

      if (!user?.businessId) {
        setError("User is not associated with any business.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      params.append("businessId", user.businessId);

      // Append filters to the query only if they have a value
      if (filters.employeeId) params.append("employeeId", filters.employeeId);
      if (filters.month) params.append("month", filters.month);
      if (filters.year) params.append("year", filters.year);
      
      const response = await fetch(`/api/payroll?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPayrolls(data.payrolls || []);
        calculateStats(data.payrolls || []);
      } else {
        setError(data.msg || "Failed to fetch payroll history.");
        setPayrolls([]);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/business');
      const data = await response.json();
      if (data.success) {
        setBusinesses(data.data ? (Array.isArray(data.data) ? data.data : [data.data]) : []);
      }
    } catch (err) { console.error('Error fetching businesses:', err); }
  };

  const fetchEmployees = async () => {
    try {
      const user = await auth();
      if (!user?.businessId) return;
      const response = await fetch(`/api/business/employee?businessId=${user.businessId}`);
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data || []);
      }
    } catch (err) { console.error('Error fetching employees:', err); }
  };

  const calculateStats = (payrolls) => {
    const total = payrolls.length;
    const paidPayrolls = payrolls.filter(p => p.paymentStatus === 'paid');
    const totalAmount = paidPayrolls.reduce((sum, payroll) => sum + (payroll.netSalary || 0), 0);
    const averageSalary = paidPayrolls.length > 0 ? totalAmount / paidPayrolls.length : 0;
    setStats({ total, totalAmount, averageSalary });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const getEmployeeDetails = (employeeId) => {
    if (typeof employeeId === 'object' && employeeId !== null) return employeeId;
    return employees.find(e => e._id === employeeId) || {};
  };

  const getBusinessDetails = (businessId) => {
    if (typeof businessId === 'object' && businessId !== null) return businessId;
    return businesses.find(b => b._id === businessId) || {};
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.accent }}>
      <header className="bg-gradient-to-r from-[#06202B] to-[#077A7D] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div>
                {/* 🎨 MODIFIED: Header updated for history page */}
                <h1 className="text-3xl font-bold">Payroll History</h1>
                <p className="mt-2" style={{ color: COLORS.primaryLight }}>
                    Search and view past payroll records
                </p>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: COLORS.accentLight, borderTop: `4px solid ${COLORS.primaryDark}` }}>
                <h3 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Total Records Found</h3>
                <p className="text-2xl font-semibold" style={{ color: COLORS.primaryDark }}>{stats.total}</p>
            </div>
            <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: COLORS.accentLight, borderTop: `4px solid ${COLORS.primary}` }}>
                <h3 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Total Amount Paid</h3>
                <p className="text-2xl font-semibold" style={{ color: COLORS.primaryDark }}>{formatCurrency(stats.totalAmount)}</p>
            </div>
            <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: COLORS.accentLight, borderTop: `4px solid ${COLORS.secondary}` }}>
                <h3 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Average Paid Salary</h3>
                <p className="text-2xl font-semibold" style={{ color: COLORS.primaryDark }}>{formatCurrency(stats.averageSalary)}</p>
            </div>
        </div>
        
        {/* ✨ ADDED: Filters section for searching */}
        <div className="rounded-lg shadow-lg p-4 mb-6" style={{ backgroundColor: COLORS.secondaryLight }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.primaryDark }}>Filter by Employee</label>
                    <select
                        value={filters.employeeId}
                        onChange={(e) => setFilters({...filters, employeeId: e.target.value})}
                        className="w-full rounded-md shadow-sm" style={{ borderColor: COLORS.primary }}
                    >
                        <option value="">All Employees</option>
                        {employees.map(employee => (
                            <option key={employee._id} value={employee._id}>{employee.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.primaryDark }}>Filter by Month</label>
                    <select
                        value={filters.month}
                        onChange={(e) => setFilters({...filters, month: e.target.value})}
                        className="w-full rounded-md shadow-sm" style={{ borderColor: COLORS.primary }}
                    >
                        <option value="">All Months</option>
                        {months.map((month, index) => (
                            <option key={month} value={index + 1}>{month}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.primaryDark }}>Filter by Year</label>
                    <select
                        value={filters.year}
                        onChange={(e) => setFilters({...filters, year: e.target.value})}
                        className="w-full rounded-md shadow-sm" style={{ borderColor: COLORS.primary }}
                    >
                        <option value="">All Years</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: COLORS.secondaryLight }}>
          {loading ? (
            <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto" style={{ borderColor: COLORS.primary }}></div><p className="mt-4" style={{ color: COLORS.primaryDark }}>Loading History...</p></div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 font-semibold">{error}</div>
          ) : payrolls.length === 0 ? (
            <div className="p-8 text-center" style={{ color: COLORS.primaryDark }}>No payroll records found for the selected criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{ backgroundColor: COLORS.primaryDark }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Net Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payrolls.map((payroll) => {
                    const employee = getEmployeeDetails(payroll.employee);
                    const isPaid = payroll.paymentStatus === 'paid';
                    return (
                      <tr key={payroll._id} className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: COLORS.accent }}>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>{employee?.name || 'N/A'}</div><div className="text-sm" style={{ color: COLORS.primary }}>{employee?.email || ''}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm" style={{ color: COLORS.primaryDark }}>{months[payroll.month - 1]} {payroll.year}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="font-medium" style={{ color: COLORS.secondaryDark }}>{formatCurrency(payroll.netSalary)}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap">{isPaid ? (<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>) : (<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {/* 🎨 MODIFIED: Only a 'View' button remains */}
                          <button onClick={() => setSelectedPayroll(payroll)} className="hover:underline" style={{ color: COLORS.primary }}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODIFIED: Simplified read-only details modal */}
      {selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.accent }}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#06202B] to-[#077A7D] text-white"><h3 className="text-lg font-medium">Payroll Details</h3></div>
            <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div><h4 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Employee</h4><p className="mt-1 text-sm" style={{ color: COLORS.secondaryDark }}>{getEmployeeDetails(selectedPayroll.employee)?.name || 'N/A'}</p></div>
                  <div><h4 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Business</h4><p className="mt-1 text-sm" style={{ color: COLORS.secondaryDark }}>{getBusinessDetails(selectedPayroll.businessId)?.businessName || 'N/A'}</p></div>
                  <div><h4 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Period</h4><p className="mt-1 text-sm" style={{ color: COLORS.secondaryDark }}>{months[selectedPayroll.month - 1]} {selectedPayroll.year}</p></div>
                  <div><h4 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Payment Status</h4><p className="mt-1 text-sm">{selectedPayroll.paymentStatus === 'paid' ? (<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>) : (<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>)}</p></div>
                  {selectedPayroll.paymentStatus === 'paid' && selectedPayroll.paymentDate && (<div><h4 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Payment Date</h4><p className="mt-1 text-sm" style={{ color: COLORS.secondaryDark }}>{format(new Date(selectedPayroll.paymentDate), 'MMM dd, yyyy HH:mm')}</p></div>)}
                  <div><h4 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Basic Salary</h4><p className="mt-1 text-sm" style={{ color: COLORS.secondaryDark }}>{formatCurrency(selectedPayroll.basicSalary)}</p></div>
                  <div><h4 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Allowances</h4><p className="mt-1 text-sm" style={{ color: COLORS.secondaryDark }}>{formatCurrency(selectedPayroll.allowances)}</p></div>
                  <div><h4 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Deductions</h4><p className="mt-1 text-sm" style={{ color: COLORS.secondaryDark }}>{formatCurrency(selectedPayroll.totalDeductions)}</p></div>
                  <div><h4 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Net Salary</h4><p className="mt-1 text-lg font-medium" style={{ color: COLORS.secondary }}>{formatCurrency(selectedPayroll.netSalary)}</p></div>
                </div>
            </div>
            {/* 🎨 MODIFIED: Footer only has a close button */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button type="button" onClick={() => setSelectedPayroll(null)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm" style={{ color: COLORS.primaryDark, backgroundColor: COLORS.accentLight }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}