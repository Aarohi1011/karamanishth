'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default function TransactionsAdmin() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('approved');
  const [adminNote, setAdminNote] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    refunded: 0,
    totalAmount: 0
  });

  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('adminAuthenticated');
    if (auth === 'true') {
      setAuthenticated(true);
      fetchTransactions();
    }
  }, [filter, searchQuery]);

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you would verify this against your backend
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      fetchTransactions();
    } else {
      setError('Invalid password');
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let url = '/api/Industry/payments';
      const params = new URLSearchParams();
      
      if (filter !== 'all') params.append('status', filter);
      if (searchQuery) params.append('search', searchQuery);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        // Transform the data to ensure consistent structure
        const processedTransactions = data.data.map(tx => ({
          ...tx,
          amount: tx.finalAmount || tx.amount || 0,
          discountedAmount: tx.totalDiscountAmount || 0,
          verifiedAt: tx.verifiedAt || null,
          adminNote: tx.adminNote || ''
        }));
        
        setTransactions(processedTransactions);
        calculateStats(processedTransactions);
      } else {
        setError(data.msg || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactions) => {
    const stats = {
      total: transactions.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      refunded: 0,
      totalAmount: 0
    };

    transactions.forEach(tx => {
      stats[tx.status]++;
      if (tx.status === 'approved') {
        stats.totalAmount += tx.finalAmount || tx.amount || 0;
      }
    });

    setStats(stats);
  };

  const handleVerify = async () => {
    if (!selectedTransaction) return;
    
    try {
      setIsVerifying(true);
      const response = await fetch('/api/Industry/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: selectedTransaction.transactionId,
          status: verificationStatus,
          adminNote
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchTransactions();
        setSelectedTransaction(null);
        setAdminNote('');
      } else {
        setError(data.msg || 'Verification failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#03045e] to-[#0077b6] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#03045e] mb-2">Admin Portal</h1>
            <p className="text-[#4080bf]">Enter your password to continue</p>
          </div>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0077b6] to-[#03045e] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077b6]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#03045e] to-[#0077b6] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Transaction Management</h1>
              <p className="mt-2 text-[#90e0ef]">Review and verify payment transactions</p>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('adminAuthenticated');
                setAuthenticated(false);
              }}
              className="px-4 py-2 bg-white text-[#03045e] rounded-lg hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-[#03045e] hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
            <p className="text-2xl font-semibold text-[#03045e]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-[#00b4d8] hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-semibold text-[#03045e]">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-green-500 hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-semibold text-[#03045e]">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-red-500 hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            <p className="text-2xl font-semibold text-[#03045e]">{stats.rejected}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-[#6699cc] hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">Refunded</h3>
            <p className="text-2xl font-semibold text-[#03045e]">{stats.refunded}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-[#4080bf] hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
            <p className="text-2xl font-semibold text-[#03045e]">{formatCurrency(stats.totalAmount)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6] focus:ring-opacity-50"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6] focus:ring-opacity-50 pl-10"
              />
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0077b6] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No transactions found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-[#03045e] to-[#0077b6]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">School</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0077b6]">{tx.transactionId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.schoolCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.planName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(tx.finalAmount || tx.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tx.status)}`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(tx.submittedAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedTransaction(tx)}
                          className="text-[#0077b6] hover:text-[#03045e] mr-3 hover:underline"
                        >
                          View
                        </button>
                        {tx.status === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedTransaction(tx);
                              setVerificationStatus('approved');
                              setAdminNote('');
                            }}
                            className="text-green-600 hover:text-green-900 hover:underline"
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#03045e] to-[#0077b6] text-white">
              <h3 className="text-lg font-medium">Transaction Details</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Transaction ID</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.transactionId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">School Code</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.schoolCode}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Plan Name</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.planName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.durationLabel || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatCurrency(selectedTransaction.finalAmount || selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedTransaction.paymentMethod || 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="mt-1 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Submitted At</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {format(new Date(selectedTransaction.submittedAt), 'MMM dd, yyyy HH:mm:ss')}
                  </p>
                </div>
                {selectedTransaction.verifiedAt && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Verified At</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {format(new Date(selectedTransaction.verifiedAt), 'MMM dd, yyyy HH:mm:ss')}
                    </p>
                  </div>
                )}
                {selectedTransaction.couponCode && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Coupon Code</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedTransaction.couponCode}</p>
                  </div>
                )}
                {selectedTransaction.totalDiscountAmount > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Discount</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatCurrency(selectedTransaction.totalDiscountAmount)}
                    </p>
                  </div>
                )}
                {selectedTransaction.studentCount && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Students</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedTransaction.studentCount}</p>
                  </div>
                )}
              </div>

              {selectedTransaction.status === 'pending' && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Verify Payment</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                      <select
                        value={verificationStatus}
                        onChange={(e) => setVerificationStatus(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6] focus:ring-opacity-50"
                      >
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                        <option value="refunded">Refund</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admin Note</label>
                      <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6] focus:ring-opacity-50"
                        placeholder="Add any notes about this verification..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTransaction.adminNote && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-700">Admin Note</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.adminNote}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077b6]"
              >
                Close
              </button>
              {selectedTransaction.status === 'pending' && (
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#0077b6] to-[#03045e] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077b6] ${isVerifying ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isVerifying ? 'Processing...' : 'Submit Verification'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}