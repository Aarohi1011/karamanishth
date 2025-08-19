'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { auth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [businesses, setBusinesses] = useState([]);
  const [employees, setEmployees] = useState([]);
  // ✅ NEW: State for calculation method
  const [calculationMethod, setCalculationMethod] = useState('day'); // 'day' or 'hour'

  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    averageSalary: 0
  });

  const router = useRouter();
  
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
      
      // Changed to /api/payrolls
      const response = await fetch(`/api/payroll?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setPayrolls(data.payrolls || []);
        calculateStats(data.payrolls || []);
      } else {
        setError(data.msg || "Failed to fetch payrolls.");
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

  // ✅ NEW: Core salary calculation function
  const calculateFinalSalary = (payroll, method) => {
    const calcMethod = method || calculationMethod;
    const { 
        basicSalary, totalWorkingDays, totalBusinessHours, 
        presentDays, halfDays, totalWorkHours, overtimeHours,
        allowances = 0, bonus = 0, tax = 0, providentFund = 0,
        professionalTax = 0, otherDeductions = 0
    } = payroll;

    let earnedSalary = 0;
    let perHourRate = 0;

    if (totalBusinessHours > 0) {
      perHourRate = basicSalary / totalBusinessHours;
    }

    if (calcMethod === 'day' && totalWorkingDays > 0) {
      const perDayRate = basicSalary / totalWorkingDays;
      earnedSalary = perDayRate * (presentDays + (halfDays * 0.5));
    } else if (calcMethod === 'hour' && totalBusinessHours > 0) {
      earnedSalary = perHourRate * totalWorkHours;
    }

    // Overtime pay at 1.5x hourly rate
    const overtimePay = overtimeHours * perHourRate * 1.5;

    const grossSalary = earnedSalary + overtimePay + allowances + bonus;
    const absenceDeduction = basicSalary - earnedSalary;
    const totalDeductions = absenceDeduction + tax + providentFund + professionalTax + otherDeductions;
    const netSalary = grossSalary - totalDeductions;

    return {
      earnedSalary: isNaN(earnedSalary) ? 0 : earnedSalary,
      overtimePay: isNaN(overtimePay) ? 0 : overtimePay,
      grossSalary: isNaN(grossSalary) ? 0 : grossSalary,
      totalDeductions: isNaN(totalDeductions) ? 0 : totalDeductions,
      netSalary: isNaN(netSalary) ? 0 : netSalary,
      absenceDeduction: isNaN(absenceDeduction) ? 0 : absenceDeduction
    };
  };

  const calculateStats = (payrolls) => {
    const total = payrolls.length;
    const paidPayrolls = payrolls.filter(p => p.paymentStatus === 'paid');
    const totalAmount = paidPayrolls.reduce((sum, payroll) => sum + (payroll.netSalary || 0), 0);
    const averageSalary = paidPayrolls.length > 0 ? totalAmount / paidPayrolls.length : 0;
    setStats({ total, totalAmount, averageSalary });
  };
  
  // ✅ UPDATED: Now saves the calculated salary
  const handleMarkAsPaid = async (payrollId) => {
    if (!confirm('This will calculate the final salary and mark it as paid. Proceed?')) return;
    
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

  // ... (handleDeletePayroll, handleRefresh, formatCurrency etc. are mostly the same)
  const handleDeletePayroll = async (id) => {
    if (!confirm('Are you sure you want to delete this payroll record?')) return;
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
    }).format(amount);
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const getEmployeeDetails = (employeeId) => (typeof employeeId === 'object' && employeeId !== null) ? employeeId : (employees.find(e => e._id === employeeId) || {});
  const getBusinessDetails = (businessId) => (typeof businessId === 'object' && businessId !== null) ? businessId : (businesses.find(b => b._id === businessId) || {});


  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.accent }}>
      <header className="bg-gradient-to-r from-[#06202B] to-[#077A7D] text-white shadow-lg">
        {/* ... Header JSX is the same ... */}
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Payroll Management</h1>
                    <p className="mt-2" style={{ color: COLORS.primaryLight }}>
                        Showing payroll for {format(new Date(), 'MMMM yyyy')}
                    </p>
                </div>
                <div>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', hover: { backgroundColor: 'rgba(255, 255, 255, 0.2)' } }}
                >
                    <svg className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5m-5 5a9 9 0 115.66-16.25L13 7" />
                    </svg>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* ... Stats cards JSX is the same ... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: COLORS.accentLight, borderTop: `4px solid ${COLORS.primaryDark}` }}>
                <h3 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Total Payroll Records</h3>
                <p className="text-2xl font-semibold" style={{ color: COLORS.primaryDark }}>{stats.total}</p>
            </div>
            <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: COLORS.accentLight, borderTop: `4px solid ${COLORS.primary}` }}>
                <h3 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Total Amount Paid (This Month)</h3>
                <p className="text-2xl font-semibold" style={{ color: COLORS.primaryDark }}>{formatCurrency(stats.totalAmount)}</p>
            </div>
            <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: COLORS.accentLight, borderTop: `4px solid ${COLORS.secondary}` }}>
                <h3 className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>Average Paid Salary</h3>
                <p className="text-2xl font-semibold" style={{ color: COLORS.primaryDark }}>{formatCurrency(stats.averageSalary)}</p>
            </div>
        </div>
        
        {/* ✅ NEW: Calculation method toggle */}
        <div className="flex justify-end items-center mb-4">
          <span className="mr-3 text-sm font-medium" style={{color: COLORS.primaryDark}}>Calculation Basis:</span>
          <div className="relative inline-flex items-center cursor-pointer rounded-full p-1" style={{backgroundColor: COLORS.accentLight}}>
            <button onClick={() => setCalculationMethod('day')} className={`px-4 py-1 text-sm rounded-full transition-colors ${calculationMethod === 'day' ? 'text-white shadow' : 'text-gray-700'}`} style={{backgroundColor: calculationMethod === 'day' ? COLORS.primary : 'transparent'}}>
              Per Day
            </button>
            <button onClick={() => setCalculationMethod('hour')} className={`px-4 py-1 text-sm rounded-full transition-colors ${calculationMethod === 'hour' ? 'text-white shadow' : 'text-gray-700'}`} style={{backgroundColor: calculationMethod === 'hour' ? COLORS.primary : 'transparent'}}>
              Per Hour
            </button>
          </div>
        </div>

        <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: COLORS.secondaryLight }}>
          {loading ? (
            <div className="p-8 text-center">...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 font-semibold">{error}</div>
          ) : payrolls.length === 0 ? (
            <div className="p-8 text-center">No payroll records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{ backgroundColor: COLORS.primaryDark }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Net Salary (Calculated)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payrolls.map((payroll) => {
                    const employee = getEmployeeDetails(payroll.employee);
                    const isPaid = payroll.paymentStatus === 'paid';
                    
                    // ✅ UPDATED: Use calculated salary for display
                    const calculated = calculateFinalSalary(payroll);
                    const displaySalary = isPaid ? payroll.netSalary : calculated.netSalary;

                    return (
                      <tr key={payroll._id} className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: COLORS.accent }}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium" style={{ color: COLORS.primaryDark }}>{employee?.name || 'N/A'}</div>
                            <div className="text-sm" style={{ color: COLORS.primary }}>{employee?.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium" style={{ color: COLORS.secondaryDark }}>{formatCurrency(displaySalary)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {isPaid ? (<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>) : (<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <button onClick={() => setSelectedPayroll(payroll)} className="hover:underline" style={{ color: COLORS.primary }}>View</button>
                          {!isPaid && (
                            <button onClick={() => handleMarkAsPaid(payroll._id)} className="px-3 py-1 text-xs rounded-md shadow-sm text-white hover:opacity-90" style={{ backgroundColor: COLORS.primary }}>Pay</button>
                          )}
                          <button onClick={() => handleDeletePayroll(payroll._id)} className="hover:underline" style={{ color: COLORS.secondary }}>Delete</button>
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

      {/* ✅ UPDATED: Modal now shows detailed breakdown */}
      {selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.accent }}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#06202B] to-[#077A7D] text-white">
              <h3 className="text-lg font-medium">Payroll Details for {getEmployeeDetails(selectedPayroll.employee)?.name}</h3>
            </div>
            <div className="px-6 py-4">
                {(() => {
                    const final = calculateFinalSalary(selectedPayroll);
                    return (
                        <div className="space-y-4">
                            <div className="p-4 rounded-md" style={{backgroundColor: COLORS.accentLight}}>
                                <h4 className="font-bold text-lg text-center mb-2" style={{color: COLORS.primaryDark}}>Salary Calculation Breakdown</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <span style={{color: COLORS.primaryDark}}>Basic Salary (Full Month):</span><span className="font-medium text-right" style={{color: COLORS.secondaryDark}}>{formatCurrency(selectedPayroll.basicSalary)}</span>
                                    <span style={{color: COLORS.primaryDark}}>Total Working Days:</span><span className="font-medium text-right" style={{color: COLORS.secondaryDark}}>{selectedPayroll.totalWorkingDays} days</span>
                                    <span style={{color: COLORS.primaryDark}}>Present Days (incl. half-days):</span><span className="font-medium text-right" style={{color: COLORS.secondaryDark}}>{selectedPayroll.presentDays + (selectedPayroll.halfDays * 0.5)} days</span>
                                    <span className="text-green-700">Earned Salary (from attendance):</span><span className="font-medium text-right text-green-700">{formatCurrency(final.earnedSalary)}</span>
                                    <span className="text-green-700">Overtime Pay:</span><span className="font-medium text-right text-green-700">{formatCurrency(final.overtimePay)}</span>
                                    <span className="text-red-700">Deduction for Absence:</span><span className="font-medium text-right text-red-700">-{formatCurrency(final.absenceDeduction)}</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-md" style={{backgroundColor: COLORS.secondaryLight}}>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <span style={{color: COLORS.primaryDark}}>Gross Salary (Earned + OT):</span><span className="font-medium text-right" style={{color: COLORS.secondaryDark}}>{formatCurrency(final.grossSalary)}</span>
                                    <span style={{color: COLORS.primaryDark}}>Total Deductions:</span><span className="font-medium text-right" style={{color: COLORS.secondaryDark}}>{formatCurrency(final.totalDeductions)}</span>
                                    <hr className="col-span-2 my-1"/>
                                    <span className="font-bold text-base" style={{color: COLORS.primaryDark}}>Final Net Salary:</span><span className="font-bold text-right text-base" style={{color: COLORS.secondary}}>{formatCurrency(final.netSalary)}</span>
                                </div>
                            </div>
                        </div>
                    )
                })()}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button type="button" onClick={() => setSelectedPayroll(null)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm">Close</button>
              {selectedPayroll.paymentStatus !== 'paid' && (
                <button type="button" onClick={() => handleMarkAsPaid(selectedPayroll._id)} disabled={loading} className="px-4 py-2 border-transparent rounded-md shadow-sm text-white" style={{ backgroundColor: COLORS.secondary, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Processing...' : 'Mark as Paid'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}