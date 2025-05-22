'use client'
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert(`Thank you for your interest! We'll contact you at ${email}`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-[#F5EEDD]">
      <Head>
        <title>QR Attendance Pro | Modern Employee Attendance System</title>
        <meta name="description" content="Streamline employee attendance with QR scanning technology and powerful analytics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-[#06202B] text-[#F5EEDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-[#7AE2CF] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#06202B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold">QR Attendance Pro</span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-[#7AE2CF] transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-[#7AE2CF] transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-[#7AE2CF] transition-colors">Pricing</a>
              <a href="#contact" className="hover:text-[#7AE2CF] transition-colors">Contact</a>
              <button className="bg-[#077A7D] hover:bg-[#065E60] text-white px-4 py-2 rounded-md transition-colors">
                Get Started
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#06202B] pb-3 px-4">
            <div className="flex flex-col space-y-2">
              <a href="#features" className="hover:text-[#7AE2CF] transition-colors py-2">Features</a>
              <a href="#how-it-works" className="hover:text-[#7AE2CF] transition-colors py-2">How It Works</a>
              <a href="#pricing" className="hover:text-[#7AE2CF] transition-colors py-2">Pricing</a>
              <a href="#contact" className="hover:text-[#7AE2CF] transition-colors py-2">Contact</a>
              <button className="bg-[#077A7D] hover:bg-[#065E60] text-white px-4 py-2 rounded-md transition-colors w-full">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-[#06202B] text-[#F5EEDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Modern Employee Attendance <span className="text-[#7AE2CF]">With QR Technology</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-300">
                Streamline your workforce management with our intuitive QR-based attendance system. Get real-time insights and powerful analytics for better decision making.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#077A7D] hover:bg-[#065E60] text-white px-6 py-3 rounded-md transition-colors font-medium">
                  Start Free Trial
                </button>
                <button className="border-2 border-[#7AE2CF] text-[#7AE2CF] hover:bg-[#7AE2CF] hover:text-[#06202B] px-6 py-3 rounded-md transition-colors font-medium">
                  See Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#077A7D] rounded-2xl p-2 transform rotate-1">
                <div className="bg-[#06202B] rounded-xl overflow-hidden border-2 border-[#7AE2CF] transform -rotate-1">
                  <img src="/dashboard-preview.jpg" alt="Dashboard Preview" className="w-full h-auto" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#7AE2CF] p-3 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="bg-[#06202B] p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="ml-2 text-[#06202B]">
                    <p className="font-bold">98%</p>
                    <p className="text-sm">Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F5EEDD] to-transparent"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#F5EEDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#06202B] mb-4">Powerful Features</h2>
            <p className="text-lg text-[#077A7D] max-w-2xl mx-auto">
              Everything you need to manage employee attendance efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7AE2CF]">
              <div className="p-6">
                <div className="bg-[#06202B] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#06202B] mb-2">QR Code Attendance</h3>
                <p className="text-gray-600">
                  Employees simply scan QR codes to check in and out. No more manual time tracking or buddy punching.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7AE2CF]">
              <div className="p-6">
                <div className="bg-[#06202B] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Real-time Analytics</h3>
                <p className="text-gray-600">
                  Get instant insights into attendance patterns, late arrivals, early departures, and more with beautiful dashboards.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7AE2CF]">
              <div className="p-6">
                <div className="bg-[#06202B] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Overtime Tracking</h3>
                <p className="text-gray-600">
                  Automatically track overtime hours and calculate payments based on your company policies.
                </p>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7AE2CF]">
              <div className="p-6">
                <div className="bg-[#06202B] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Multi-location Support</h3>
                <p className="text-gray-600">
                  Manage attendance across multiple offices or sites from a single dashboard with location tracking.
                </p>
              </div>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7AE2CF]">
              <div className="p-6">
                <div className="bg-[#06202B] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Custom Reports</h3>
                <p className="text-gray-600">
                  Generate detailed reports for payroll, HR audits, or management reviews with just a few clicks.
                </p>
              </div>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7AE2CF]">
              <div className="p-6">
                <div className="bg-[#06202B] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Security First</h3>
                <p className="text-gray-600">
                  Enterprise-grade security with encryption, role-based access, and audit logs to protect your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#06202B] text-[#F5EEDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How QR Attendance Pro Works</h2>
            <p className="text-lg text-[#7AE2CF] max-w-2xl mx-auto">
              Simple setup, powerful results in just 3 easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-4 md:-left-6 top-0 bg-[#7AE2CF] text-[#06202B] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-lg md:text-xl">
                1
              </div>
              <div className="bg-[#077A7D] rounded-xl p-6 pl-12 md:pl-14 h-full">
                <h3 className="text-xl font-bold mb-3">Set Up Your Account</h3>
                <p className="text-gray-200">
                  Create your company account, add employees, and generate unique QR codes for each location.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-4 md:-left-6 top-0 bg-[#7AE2CF] text-[#06202B] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-lg md:text-xl">
                2
              </div>
              <div className="bg-[#077A7D] rounded-xl p-6 pl-12 md:pl-14 h-full">
                <h3 className="text-xl font-bold mb-3">Employees Scan to Check In/Out</h3>
                <p className="text-gray-200">
                  Employees use their smartphones to scan the QR code when arriving and leaving work.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-4 md:-left-6 top-0 bg-[#7AE2CF] text-[#06202B] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-lg md:text-xl">
                3
              </div>
              <div className="bg-[#077A7D] rounded-xl p-6 pl-12 md:pl-14 h-full">
                <h3 className="text-xl font-bold mb-3">Get Insights & Reports</h3>
                <p className="text-gray-200">
                  View real-time attendance data, generate reports, and gain valuable workforce insights.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <button className="bg-[#7AE2CF] hover:bg-[#5ECCB7] text-[#06202B] px-8 py-3 rounded-md transition-colors font-bold text-lg">
              Watch Video Demo
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#F5EEDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#06202B] mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-[#077A7D] max-w-2xl mx-auto">
              Choose the plan that fits your organization's needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7AE2CF] transform hover:scale-105 transition-transform">
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Starter</h3>
                <p className="text-gray-600 mb-6">Perfect for small teams</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#077A7D]">$9</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Up to 20 employees
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basic attendance tracking
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Single location
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Custom reports
                  </li>
                </ul>
                <button className="w-full bg-[#06202B] hover:bg-[#0D3A4A] text-white py-3 rounded-md transition-colors">
                  Get Started
                </button>
              </div>
            </div>
            
            {/* Popular Plan */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[#077A7D] transform hover:scale-105 transition-transform relative">
              <div className="absolute top-0 right-0 bg-[#077A7D] text-white text-xs font-bold px-3 py-1 transform translate-x-2 -translate-y-2 rotate-12">
                MOST POPULAR
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Business</h3>
                <p className="text-gray-600 mb-6">Best for growing companies</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#077A7D]">$29</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Up to 100 employees
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced attendance tracking
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Up to 3 locations
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basic analytics
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Custom reports
                  </li>
                </ul>
                <button className="w-full bg-[#077A7D] hover:bg-[#065E60] text-white py-3 rounded-md transition-colors font-bold">
                  Get Started
                </button>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7AE2CF] transform hover:scale-105 transition-transform">
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large organizations</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#077A7D]">$99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited employees
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Premium attendance tracking
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited locations
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Custom reports
                  </li>
                </ul>
                <button className="w-full bg-[#06202B] hover:bg-[#0D3A4A] text-white py-3 rounded-md transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Need a custom solution? <a href="#contact" className="text-[#077A7D] hover:underline">Contact us</a> for enterprise pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#7AE2CF] text-[#06202B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Companies Worldwide</h2>
            <p className="text-lg max-w-2xl mx-auto">
              Join thousands of businesses that streamlined their attendance management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#06202B] flex items-center justify-center text-white font-bold mr-4">
                  JD
                </div>
                <div>
                  <h4 className="font-bold">John Doe</h4>
                  <p className="text-sm text-gray-600">HR Manager, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-700">
                "QR Attendance Pro has transformed how we track employee attendance. The analytics dashboard gives us insights we never had before."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#06202B] flex items-center justify-center text-white font-bold mr-4">
                  SM
                </div>
                <div>
                  <h4 className="font-bold">Sarah Miller</h4>
                  <p className="text-sm text-gray-600">Operations Director, RetailPlus</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The multi-location support is fantastic. We manage 5 stores from one dashboard and payroll processing is now 70% faster."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#06202B] flex items-center justify-center text-white font-bold mr-4">
                  AR
                </div>
                <div>
                  <h4 className="font-bold">Alex Rodriguez</h4>
                  <p className="text-sm text-gray-600">CEO, StartupXYZ</p>
                </div>
              </div>
              <p className="text-gray-700">
                "As a small business, we needed an affordable solution. QR Attendance Pro gave us enterprise features at a fraction of the cost."
              </p>
              <div className="flex mt-4">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#06202B] text-[#F5EEDD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Attendance Management?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of businesses that trust QR Attendance Pro for accurate, efficient employee time tracking.
          </p>
          <button className="bg-[#7AE2CF] hover:bg-[#5ECCB7] text-[#06202B] px-8 py-4 rounded-md transition-colors font-bold text-lg">
            Start Your Free 14-Day Trial
          </button>
          <p className="mt-4 text-gray-300">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#F5EEDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#06202B] mb-6">Get In Touch</h2>
              <p className="text-lg text-gray-700 mb-8">
                Have questions or need a custom solution? Our team is here to help you find the perfect attendance management system for your organization.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#06202B] p-2 rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-[#06202B]">Email Us</h4>
                    <p className="text-gray-600">support@qrattendancepro.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#06202B] p-2 rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-[#06202B]">Call Us</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#06202B] p-2 rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-[#06202B]">Visit Us</h4>
                    <p className="text-gray-600">123 Business Ave, Suite 500<br />San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-[#7AE2CF]">
              <h3 className="text-2xl font-bold text-[#06202B] mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#077A7D] hover:bg-[#065E60] text-white py-3 rounded-md transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#06202B] text-[#F5EEDD] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-[#7AE2CF] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#06202B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold">QR Attendance Pro</span>
              </div>
              <p className="mt-4 text-gray-400">
                Modern QR-based employee attendance system with powerful analytics.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2023 QR Attendance Pro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#7AE2CF] transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}