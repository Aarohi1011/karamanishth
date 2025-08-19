'use client';
import React, { useState, useEffect } from 'react';

const PaymentModal = ({ plan, onClose, currentEmployeeCount = 1, user }) => {
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMonths, setSelectedMonths] = useState(1); // Default to 1 month
  const [employeeCount, setEmployeeCount] = useState(currentEmployeeCount);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // Default to UPI

  // Price calculations
  const pricePerEmployeePerMonth = plan.pricePerEmployee || 100; // Default to 100 if not specified
  const baseAmount = pricePerEmployeePerMonth * employeeCount * selectedMonths;

  // Duration discounts
  const durationDiscounts = {
    1: 0,   // No discount for 1 month
    6: 5,   // 5% discount for 6 months
    12: 10  // 10% discount for 12 months
  };
  
  const durationDiscountPercent = durationDiscounts[selectedMonths] || 0;
  const durationDiscountAmount = (baseAmount * durationDiscountPercent) / 100;
  const subtotalAfterDurationDiscount = baseAmount - durationDiscountAmount;

  // Coupon calculations
  const couponDiscountPercent = appliedCoupon?.discount || 0;
  const couponDiscountAmount = (subtotalAfterDurationDiscount * couponDiscountPercent) / 100;

  // Final amounts
  const totalDiscountAmount = durationDiscountAmount + couponDiscountAmount;
  const finalAmount = baseAmount - totalDiscountAmount;

  // Effective rate per employee for the entire duration
  const effectiveRatePerEmployee = finalAmount / employeeCount;

  // Available coupons
  const availableCoupons = [
    { code: 'STARTUP25', discount: 25, description: '25% off for startups' },
    { code: 'TEAM10', discount: 10, description: '10% off for teams' },
    { code: 'YEARLY30', discount: 30, description: '30% off for yearly subscriptions' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId) {
      setErrorMessage('Please enter your transaction ID');
      return;
    }

    try {
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          planName: plan.name,
          employeeCount,
          planDurationMonths: selectedMonths,
          paymentMethod
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit transaction');
      }

      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const applyCoupon = () => {
    const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setErrorMessage('');
  };

  const handleMonthChange = (months) => {
    setSelectedMonths(months);
  };

  const calculateSavings = () => {
    return totalDiscountAmount;
  };

  const savingsPercentage = Math.round((totalDiscountAmount / baseAmount) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#03045e]">Complete Your Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="mb-4 sm:mb-6">
            <p className="text-base sm:text-lg text-[#4080bf]">
              Youre subscribing to: <span className="font-semibold">{plan.name}</span>
            </p>

            {/* Employee count input */}
            <div className="mt-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Employees
              </label>
              <input
                type="number"
                min="1"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
              />
            </div>

            {/* Month selector */}
            <div className="mt-3 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 6, 12].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => handleMonthChange(months)}
                    className={`py-2 px-3 text-sm rounded-md border transition-all ${selectedMonths === months
                        ? 'bg-[#0077b6] text-white border-[#0077b6]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {months === 1 ? '1 Month' :
                     months === 6 ? '6 Months (5% off)' :
                     '12 Months (10% off)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Price display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Base Price:</span>
                <span className="font-medium">
                  ₹{pricePerEmployeePerMonth}/month × {employeeCount} employees × {selectedMonths} months
                </span>
              </div>

              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ₹{baseAmount.toFixed(2)}
                </span>
              </div>

              {durationDiscountPercent > 0 && (
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Duration Discount ({durationDiscountPercent}%):</span>
                  <span className="text-green-600">
                    -₹{durationDiscountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Coupon Discount ({appliedCoupon.discount}%):</span>
                  <span className="text-green-600">
                    -₹{couponDiscountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                <span className="font-semibold">Total Price:</span>
                <span className="font-bold text-lg text-[#03045e]">
                  ₹{finalAmount.toFixed(2)}
                </span>
              </div>

              <div className="mt-1 text-sm text-gray-600">
                Effective rate: ₹{effectiveRatePerEmployee.toFixed(2)} per employee for {selectedMonths} months
              </div>

              {totalDiscountAmount > 0 && (
                <div className="mt-1 text-sm text-green-600">
                  You save ₹{calculateSavings().toFixed(2)} ({savingsPercentage}%)
                </div>
              )}
            </div>
          </div>

          {!isSubmitted ? (
            <>
              <div className="mb-4 sm:mb-6">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                    placeholder="Enter coupon code"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-300 text-sm sm:text-base"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="bg-[#00b4d8] hover:bg-[#0077b6] text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-sm sm:text-base"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-xs sm:text-sm">{errorMessage}</p>
                )}
                {appliedCoupon && (
                  <p className="text-green-600 text-xs sm:text-sm">
                    Coupon applied: {appliedCoupon.description}
                  </p>
                )}
                <div className="mt-2">
                  <details className="text-xs sm:text-sm text-gray-600">
                    <summary className="cursor-pointer">Available coupons</summary>
                    <ul className="mt-1 space-y-1">
                      {availableCoupons.map((coupon, index) => (
                        <li key={index} className="flex justify-between">
                          <span className="font-medium">{coupon.code}</span>
                          <span>{coupon.description}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>

              <div className="mb-4 sm:mb-6 text-center">
                <div className="bg-white p-3 sm:p-4 inline-block rounded-lg border border-gray-200">
                  <img
                    src="/QrCode.jpeg"
                    alt="UPI QR Code"
                    className="w-32 h-32 sm:w-48 sm:h-48 object-contain mb-2 mx-auto"
                  />
                  <p className="text-xs sm:text-sm text-gray-600">
                    Scan this QR code with any UPI app to pay ₹{finalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="transactionId" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Transaction ID (required)
                  </label>
                  <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                    placeholder={`Enter your ${paymentMethod} transaction ID`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0077b6] hover:bg-[#03045e] text-white font-bold py-2 sm:py-3 px-4 rounded transition-colors duration-300 text-sm sm:text-base"
                >
                  Verify Payment
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 sm:py-8">
              <div className="mb-3 sm:mb-4">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#03045e] mb-2">Thank you for your payment!</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                {selectedMonths}-month subscription for {employeeCount} employees
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                We will verify your transaction and activate your subscription within 24 hours.
              </p>

              <div className="bg-gray-50 p-3 rounded-lg inline-block mb-4">
                <p className="font-medium">Payment Summary</p>
                <p className="text-sm">Total Paid: ₹{finalAmount.toFixed(2)}</p>
                <p className="text-sm">Effective Rate: ₹{effectiveRatePerEmployee.toFixed(2)} per employee</p>
                <p className="text-sm">Employees: {employeeCount}</p>
                <p className="text-sm">Duration: {selectedMonths} months</p>
                {durationDiscountPercent > 0 && (
                  <p className="text-sm text-green-600">
                    Duration Discount: {durationDiscountPercent}%
                  </p>
                )}
                {appliedCoupon && (
                  <p className="text-sm text-green-600">
                    Coupon Used: {appliedCoupon.code} ({appliedCoupon.discount}% off)
                  </p>
                )}
                <p className="text-sm">Payment Method: {paymentMethod}</p>
              </div>

              <button
                onClick={onClose}
                className="bg-[#0077b6] hover:bg-[#03045e] text-white font-bold py-2 px-4 sm:py-2 sm:px-6 rounded transition-colors duration-300 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;