// Add "use client" at the top to make this a Client Component
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PaymentModal from '@/components/page_component/PaymentModel';
const Page = () => {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch('/api/business');
        if (!response.ok) throw new Error('Failed to fetch business details');
        const result = await response.json();
        if (result.success) {
          setBusinessInfo(result.data);
        } else {
          throw new Error(result.msg || 'An unknown error occurred');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessInfo();
  }, []);

  const plans = {
    free: {
      name: 'Free Plan',
      apiName: 'Free',
      price: 0
    },
    paid: {
      name: 'Paid Plan',
      apiName: 'Paid',
      price: 30
    }
  };
  const formattedExpiryDate = businessInfo?.subscription?.expiryDate
    ? new Date(businessInfo.subscription.expiryDate).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : 'N/A';
    const getButtonText = () => {
    if (isExpired) {
      return 'Renew Now';
    }
    if (businessInfo?.subscription?.planName === 'Free') {
      return 'Upgrade to Paid';
    }
    return 'Manage Subscription';
  };
  // NEW: Check if the plan has expired by comparing expiry date with the current date
  const isExpired = businessInfo ? new Date() > new Date(businessInfo.subscription.expiryDate) : false;
  const handleUpgradeClick = () => {
    setSelectedPlan(plans.paid); // Set the selected plan to 'Paid Plan'
    setShowPaymentModal(true); // Open the modal
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5EEDD]">
        <p className="text-xl text-[#077A7D]">Loading your plan details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5EEDD]">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#F5EEDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#06202B] mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-[#077A7D] max-w-2xl mx-auto">
              Choose the plan that fits your organization's needs
            </p>
          </div>
          
          {/* Display Current Subscription Info */}
          {businessInfo && (
            // NEW: Conditional styling for the info box based on `isExpired`
            <div className={`text-center mb-12 p-4 rounded-lg max-w-md mx-auto shadow-md transition-colors ${isExpired ? 'bg-red-100 border border-red-400' : 'bg-white/50'}`}>
              <h3 className={`text-xl font-semibold ${isExpired ? 'text-red-800' : 'text-[#06202B]'}`}>
                Your Current Plan: 
                <span className={`font-bold ${isExpired ? 'text-red-900' : 'text-[#077A7D]'}`}>
                  {' '}{businessInfo.subscription.planName}
                </span>
              </h3>
              {/* NEW: Display a different message and style if the plan is expired */}
              {isExpired ? (
                  <p className="text-red-700 mt-1 font-semibold">
                    Your plan expired on {formattedExpiryDate}. Please upgrade to continue service.
                  </p>
              ) : (
                businessInfo.subscription.planName === 'Free' && (
                  <p className="text-gray-600 mt-1">
                    Your trial expires on: <span className="font-medium">{formattedExpiryDate}</span>
                  </p>
                )
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform ${businessInfo?.subscription?.planName === 'Free' ? 'border-4 border-green-500' : 'border border-[#7AE2CF]'}`}>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Free Plan (14 Days Trial)</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#077A7D]">₹0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-700">
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Unlimited Employees</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Geolocation-Based Attendance</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Advanced Attendance Analysis</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Monthly & Weekly Reports</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Staff Management Dashboard</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Shifts and Schedule Management</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Leave and Overtime Tracking</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Automated Reports and Exports</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Smart Alerts</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Attendance Support</span>
                    </li>
                </ul>
                <Link href="https://karamanishth.sharmaindustry.in/signup" className="w-full bg-[#06202B] hover:bg-[#0D3A4A] text-white py-3 rounded-md transition-colors block text-center">
                  Start Free Trial
                </Link>
              </div>
            </div>
            
            {/* Paid Plan */}
            <div className={`bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform relative ${businessInfo?.subscription?.planName !== 'Free' ? 'border-4 border-green-500' : 'border-2 border-[#077A7D]'}`}>
              <div className="absolute top-0 right-0 bg-[#077A7D] text-white text-xs font-bold px-3 py-1 transform translate-x-2 -translate-y-2 rotate-12">
                BEST VALUE
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Paid Plan</h3>
                <p className="text-gray-600 mb-6">Yearly subscription for growing businesses</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#077A7D]">₹10</span>
                  <span className="text-gray-500">/month/employee</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">*Billed annually at ₹120 per employee</p>
                <ul className="space-y-3 mb-8 text-gray-700">
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span className="font-bold">Everything in Free Plan, plus:</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Priority Attendance Support</span>
                    </li>
                </ul>
                 <button 
                    onClick={handleUpgradeClick}
                    className="w-full bg-[#077A7D] hover:bg-[#065E60] text-white py-3 rounded-md transition-colors font-bold block text-center"
                  >
                    {getButtonText()}
                  </button>
              </div>
            </div>
          </div>
        </div>
        {/* MODIFIED: Conditionally render the modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
      </section>
    </div>
  )
}

export default Page;