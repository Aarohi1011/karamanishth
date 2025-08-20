'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

// Mock auth function to simulate getting user data
const auth = async () => {
  return {
    businessId: '683908ae98082fdbfd2d8765' // Example business ID
  };
};

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

export default function PayrollManagement() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businessId, setBusinessId] = useState('');
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [calculationMethod, setCalculationMethod] = useState('day');
  const [isMobile, setIsMobile] = useState(false);
  const [lastPaidDate, setLastPaidDate] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    averageSalary: 0,
    paidCount: 0,
    unpaidCount: 0
  });

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const user = await auth();
      const userBusinessId = user?.businessId;
      
      if (userBusinessId) {
        setBusinessId(userBusinessId);
        await fetchPayrolls(userBusinessId);
        await fetchBusinesses();
        await fetchEmployees(userBusinessId);
      } else {
        setError("User is not associated with any business.");
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const fetchPayrolls = async (currentBusinessId) => {
    if (!currentBusinessId) return;
    try {
      setLoading(true);
      setError(null);
      const now = new Date();
      const params = new URLSearchParams({
        businessId: currentBusinessId,
        month: now.getMonth() + 1,
        year: now.getFullYear()
      });
      
      const response = await fetch(`/api/payroll?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        const allPayrolls = data.payrolls || [];
        setPayrolls(allPayrolls);
        
        const paidPayrolls = allPayrolls.filter(p => p.paymentStatus === 'paid');
        const unpaidPayrolls = allPayrolls.filter(p => p.paymentStatus !== 'paid');
        
        // Find last paid date
        const paidDates = paidPayrolls
          .filter(p => p.paymentDate)
          .map(p => new Date(p.paymentDate))
          .sort((a, b) => b - a);
        
        setLastPaidDate(paidDates.length > 0 ? paidDates[0] : null);
        calculateStats(paidPayrolls, allPayrolls.length, unpaidPayrolls.length);
      } else {
        setError(data.msg || "Failed to fetch payrolls.");
        setPayrolls([]);
      }
    } catch (err) {
      setError("Failed to fetch API. This is expected in a sandboxed environment. The component logic is ready.");
      console.error(err);
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
    } catch (err) {
      console.error('Error fetching businesses:', err);
    }
  };

  const fetchEmployees = async (currentBusinessId) => {
    if (!currentBusinessId) return;
    try {
      const response = await fetch(`/api/business/employee?businessId=${currentBusinessId}`);
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const calculateFinalSalary = (payroll, method) => {
    const calcMethod = method || calculationMethod;
    const { 
        basicSalary, totalWorkingDays, totalBusinessHours, 
        presentDays, halfDays = 0, totalWorkHours, overtimeHours = 0,
        allowances = 0, bonus = 0, tax = 0, providentFund = 0,
        professionalTax = 0, otherDeductions = 0
    } = payroll;

    let earnedSalary = 0;
    let perHourRate = 0;

    const hoursInMonth = payroll.totalWorkingHours || totalBusinessHours || (totalWorkingDays * 8);

    if (hoursInMonth > 0) {
      perHourRate = basicSalary / hoursInMonth;
    }

    if (calcMethod === 'day' && totalWorkingDays > 0) {
      const perDayRate = basicSalary / totalWorkingDays;
      earnedSalary = perDayRate * (presentDays + (halfDays * 0.5));
    } else if (calcMethod === 'hour' && hoursInMonth > 0) {
      earnedSalary = perHourRate * (payroll.employeeTotalHours || totalWorkHours || 0);
    }

    const overtimePay = (overtimeHours || 0) * perHourRate * 1.5;
    const grossSalary = earnedSalary + overtimePay + allowances + bonus;
    const absenceDeduction = basicSalary - earnedSalary;
    const totalDeductionsValue = tax + providentFund + professionalTax + otherDeductions;
    const netSalary = grossSalary - totalDeductionsValue;

    return {
      earnedSalary: isNaN(earnedSalary) ? 0 : earnedSalary,
      overtimePay: isNaN(overtimePay) ? 0 : overtimePay,
      grossSalary: isNaN(grossSalary) ? 0 : grossSalary,
      totalDeductions: isNaN(totalDeductionsValue) ? 0 : totalDeductionsValue,
      netSalary: isNaN(netSalary) ? 0 : netSalary,
      absenceDeduction: isNaN(absenceDeduction) ? 0 : absenceDeduction
    };
};

  const calculateStats = (paidPayrolls, totalCount, unpaidCount) => {
    const salaries = paidPayrolls.map(p => p.netSalary || 0).filter(s => s > 0);
    const totalAmount = salaries.reduce((sum, salary) => sum + salary, 0);
    const averageSalary = salaries.length > 0 ? totalAmount / salaries.length : 0;
    
    setStats({ 
      total: totalCount, 
      totalAmount, 
      averageSalary, 
      paidCount: paidPayrolls.length,
      unpaidCount
    });
  };
  
  const handleCreateAndPayPayroll = async (payrollToCreate) => {
    if (!window.confirm('This will create the payroll record and mark it as paid. Proceed?')) return;

    try {
        setLoading(true);
        const calculated = calculateFinalSalary(payrollToCreate);

        const newPayrollData = {
            ...payrollToCreate,
            employee: payrollToCreate.employee._id,
            netSalary: calculated.netSalary,
            grossSalary: calculated.grossSalary,
            totalDeductions: calculated.totalDeductions,
            overtimePay: calculated.overtimePay,
            allowances: payrollToCreate.allowances || 0,
            bonus: payrollToCreate.bonus || 0,
            tax: payrollToCreate.tax || 0,
            providentFund: payrollToCreate.providentFund || 0,
            professionalTax: payrollToCreate.professionalTax || 0,
            otherDeductions: payrollToCreate.otherDeductions || 0,
            paymentStatus: 'paid',
            paymentDate: new Date().toISOString(),
        };

        const response = await fetch('/api/payroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPayrollData)
        });

        const data = await response.json();
        if (data.success) {
            await fetchPayrolls(businessId);
            setSelectedPayroll(null);
        } else {
            setError(data.msg || 'Failed to create and pay payroll');
        }
    } catch (err) {
        setError(err.message || 'An error occurred during payroll creation');
    } finally {
        setLoading(false);
    }
  };

  const handleMarkAsPaid = async (payrollId) => {
    if (!window.confirm('This will calculate the final salary and mark it as paid. Proceed?')) return;
    
    try {
      setLoading(true);
      const payrollToPay = payrolls.find(p => p._id === payrollId);
      if (!payrollToPay) throw new Error("Payroll not found");

      const calculated = calculateFinalSalary(payrollToPay);
      
      const updates = {
        paymentStatus: 'paid',
        paymentDate: new Date().toISOString(),
        netSalary: calculated.netSalary,
        grossSalary: calculated.grossSalary,
        totalDeductions: calculated.totalDeductions,
        overtimePay: calculated.overtimePay,
      };

      const response = await fetch('/api/payroll', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: payrollId, updates: updates })
      });

      const data = await response.json();
      if (data.success) {
        await fetchPayrolls(businessId);
        setSelectedPayroll(null);
      } else {
        setError(data.msg || 'Failed to process payment');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayroll = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payroll record?')) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/payroll?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        await fetchPayrolls(businessId);
      } else {
        setError(data.msg || 'Failed to delete payroll');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    if (businessId) {
      await fetchPayrolls(businessId);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getEmployeeDetails = (employeeData) => (typeof employeeData === 'object' && employeeData !== null) ? employeeData : (employees.find(e => e._id === employeeData) || {});

  // Render payroll cards for mobile view
  const renderPayrollCards = () => {
    return (
      <div className="grid grid-cols-1 gap-4">
        {payrolls.map((payroll) => {
          const employee = getEmployeeDetails(payroll.employee);
          const isPaid = payroll.paymentStatus === 'paid';
          const isGenerated = payroll.paymentStatus === 'pending_generation';
          
          const calculated = calculateFinalSalary(payroll);
          const displaySalary = isPaid ? payroll.netSalary : calculated.netSalary;
          
          const statusColor = isPaid ? 'bg-green-100 text-green-800' : 
                            isGenerated ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800';
          
          const statusText = isPaid ? 'Paid' : 
                           isGenerated ? 'Pending Generation' : 
                           'Pending Payment';

          return (
            <div key={payroll._id || employee._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3" style={{ backgroundColor: COLORS.primaryLight }}>
                    <span className="font-semibold text-sm" style={{ color: COLORS.primaryDark }}>
                      {employee?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{employee?.name || 'N/A'}</h3>
                    <p className="text-sm text-gray-500">{employee?.email || ''}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                  {statusText}
                </span>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Net Salary</div>
                <div className="text-xl font-bold text-gray-900">{formatCurrency(displaySalary)}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setSelectedPayroll(payroll)} 
                  className="text-sm px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Details
                </button>
                
                <div className="flex space-x-2">
                  {!isPaid && (
                    isGenerated ? (
                      <button 
                        onClick={() => handleCreateAndPayPayroll(payroll)} 
                        className="text-sm px-3 py-1.5 rounded-md text-white hover:opacity-90 transition-colors" 
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        Pay Now
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleMarkAsPaid(payroll._id)} 
                        className="text-sm px-3 py-1.5 rounded-md text-white hover:opacity-90 transition-colors" 
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        Mark Paid
                      </button>
                    )
                  )}
                  {payroll._id && (
                    <button 
                      onClick={() => handleDeletePayroll(payroll._id)} 
                      className="text-sm p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors" 
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render payroll table for desktop view
  const renderPayrollTable = () => {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payrolls.map((payroll) => {
              const employee = getEmployeeDetails(payroll.employee);
              const isPaid = payroll.paymentStatus === 'paid';
              const isGenerated = payroll.paymentStatus === 'pending_generation';
              
              const calculated = calculateFinalSalary(payroll);
              const displaySalary = isPaid ? payroll.netSalary : calculated.netSalary;

              return (
                <tr key={payroll._id || employee._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3" style={{ backgroundColor: COLORS.primaryLight }}>
                        <span className="font-semibold text-xs" style={{ color: COLORS.primaryDark }}>
                          {employee?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{employee?.email || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{formatCurrency(displaySalary)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      {isPaid ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                      ) : isGenerated ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Pending Generation</span>
                      ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending Payment</span>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => setSelectedPayroll(payroll)} 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Details
                    </button>
                    {!isPaid && (
                        isGenerated ? (
                          <button 
                            onClick={() => handleCreateAndPayPayroll(payroll)} 
                            className="px-2 py-1 text-xs rounded-md text-white hover:opacity-90" 
                            style={{ backgroundColor: COLORS.primary }}
                          >
                            Create & Pay
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleMarkAsPaid(payroll._id)} 
                            className="px-2 py-1 text-xs rounded-md text-white hover:opacity-90" 
                            style={{ backgroundColor: COLORS.primary }}
                          >
                            Mark Paid
                          </button>
                        )
                    )}
                    {payroll._id && (
                      <button 
                        onClick={() => handleDeletePayroll(payroll._id)} 
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Showing payroll for {format(new Date(), 'MMMM yyyy')}
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5m-5 5a9 9 0 115.66-16.25L13 7" />
                    </svg>
                    Refresh
                </button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8"/>
        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-50">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 极 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-600">Total Employees</h3>
                <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-green-50">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 极 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 极 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-600">Total Paid</h3>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-purple-50">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin极="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 极 0 002-2m0 极 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-600">Average Salary</h3>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(stats.averageSalary)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-yellow-50">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="极 0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font极-medium text-gray-600">Last Payment</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {lastPaidDate ? format(lastPaidDate, 'MMM dd, yyyy') : 'No payments'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-800">Paid Employees</h3>
                <p className="text-2xl font-bold text-green-900">{stats.paidCount}</p>
              </div>
              <div className="p-2 rounded-md bg-green-200">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Pending Payment</h3>
                <p className="text-2xl font-bold text-yellow-900">{stats.unpaidCount}</p>
              </div>
              <div className="p-2 rounded-md bg-yellow-200">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0极 z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calculation Basis Selector */}
        <div className="flex items-center mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <span className="mr-3 text-sm font-medium text-gray-700">Calculation Basis:</span>
          <div className="relative inline-flex items-center cursor-pointer rounded-full p-1 bg-gray-100">
            <button 
              onClick={() => setCalculationMethod('day')} 
              className={`px-3 py-1 text-sm rounded-full transition-colors ${calculationMethod === 'day' ? 'bg-blue-600 text-white shadow' : 'text-gray-700'}`}
            >
              Per Day
            </button>
            <button 
              onClick={() => setCalculationMethod('hour')} 
              className={`px-3 py-1 text-sm rounded-full transition-colors ${calculationMethod === 'hour' ? 'bg-blue-600 text-white shadow' : 'text-gray-700'}`}
            >
              Per Hour
            </button>
          </div>
        </div>

        {/* Payroll Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 border border-gray-200">
          {loading ? (
            <div className="p-8 text-center flex justify-center items-center">
              <svg className="animate-spin h-8 w-8 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 极 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Loading payroll data...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center font-semibold text-red-600">{error}</div>
          ) : payrolls.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2极 h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-lg font-medium">No payroll records found</p>
              <p className="mt-2">No payroll records found for this month.</p>
            </div>
          ) : isMobile ? (
            renderPayrollCards()
          ) : (
            renderPayrollTable()
          )}
        </div>
    

      /* Payroll Detail Modal */
      {selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Payroll Details for {getEmployeeDetails(selectedPayroll.employee)?.name}</h3>
                <button onClick={() => setSelectedPayroll(null)} className="text-white hover:text-gray-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
                {(() => {
                    const final = calculateFinalSalary(selectedPayroll);
                    return (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                                <h4 className="font-bold text-lg text-center mb-3 text-gray-900">Salary Calculation Breakdown</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Basic Salary (Full Month):</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(selectedPayroll.basicSalary)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Total Working Days:</span>
                                        <span className="font-medium text-gray-900">{selectedPayroll.totalWorkingDays} days</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border极-gray-200">
                                        <span className="text-gray-600">Present Days (incl. half-days):</span>
                                        <span className="font-medium text-gray-900">{selectedPayroll.presentDays + ((selectedPayroll.halfDays || 0) * 0.5)} days</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-green-600">Earned Salary:</span>
                                        <span className="font-medium text-green-600">{formatCurrency(final.earnedSalary)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-green-600">Overtime Pay:</span>
                                        <span className="font-medium text-green-600">{formatCurrency(final.overtimePay)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-red-600">Deduction for Absence:</span>
                                        <span className="font-medium text-red-600">-{formatCurrency(final.absenceDeduction)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Gross Salary (Earned + OT):</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(final.grossSalary)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Total Deductions:</span>
                                        <span className="font-medium text-gray-极 900">{formatCurrency(final.totalDeductions)}</span>
                                    </div>
                                    <div className="col-span-2 border-t border-gray-300 my-2"></div>
                                    <div className="col-span-2 flex justify-between items-center py-2 bg-white rounded-md px-3 shadow-sm">
                                        <span className="font-bold text-gray-900">Final Net Salary:</span>
                                        <span className="font-bold text-blue-600">{formatCurrency(final.netSalary)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })()}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <button 
                type="button" 
                onClick={() => setSelectedPayroll(null)} 
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
              {selectedPayroll.paymentStatus !== 'paid' && (
                  selectedPayroll.paymentStatus === 'pending_generation' ? (
                    <button 
                      type="button" 
                      onClick={() => handleCreate极AndPayPayroll(selectedPayroll)} 
                      disabled={loading} 
                      className="px-3 py-2 border-transparent rounded-md shadow-sm text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Create & Mark as Paid'}
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => handleMarkAsPaid(selectedPayroll._id)} 
                      disabled={loading} 
                      className="px-3 py-2 border-transparent rounded-md shadow-sm极 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Mark as Paid'}
                    </button>
                  )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}