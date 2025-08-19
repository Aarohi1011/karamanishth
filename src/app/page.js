'use client'
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

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
        <title>Karmanishth | Simple Employee Attendance Management</title>
        <meta name="description" content="Simplify employee attendance tracking with smart QR technology and reliable analytics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-[#06202B] text-[#F5EEDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Image 
                  src="/logo.jpg" 
                  alt="Karmanishth Logo" 
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="ml-3 text-xl font-bold">Karmanishth</span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-[#7AE2CF] transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-[#7AE2CF] transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-[#7AE2CF] transition-colors">Pricing</a>
              <a href="#contact" className="hover:text-[#7AE2CF] transition-colors">Contact</a>
              <Link href="https://karamanishth.sharmaindustry.in/signup" className="bg-[#077A7D] hover:bg-[#065E60] text-white px-4 py-2 rounded-md transition-colors">
                Get Started
              </Link>
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
              <Link href="/signup" className="bg-[#077A7D] hover:bg-[#065E60] text-white px-4 py-2 rounded-md transition-colors w-full text-center">
                Get Started
              </Link>
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
                Smart Employee Attendance <span className="text-[#7AE2CF]">Made Simple</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-300">
                Streamline your workforce management with our intuitive QR-based attendance system. Get real-time insights and simplified tracking for better attendance management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#077A7D] hover:bg-[#065E60] text-white px-6 py-3 rounded-md transition-colors font-medium">
                  <Link href='/login'>
                    Login
                  </Link>
                </button>
                <Link href="/signup" className="border-2 border-[#7AE2CF] text-[#7AE2CF] hover:bg-[#7AE2CF] hover:text-[#06202B] px-6 py-3 rounded-md transition-colors font-medium text-center">
                  Get Started
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#077A7D] rounded-2xl p-2 transform rotate-1">
                <div className="bg-[#06202B] rounded-xl overflow-hidden border-2 border-[#7AE2CF] transform -rotate-1">
                  <Image 
                    src="/dashboard-preview.jpg" 
                    alt="Dashboard Preview" 
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#7AE2CF] p-3 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="bg-[#06202B] p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Smart Attendance</h3>
                <p className="text-gray-600">
                  Employees simply scan QR codes to check in and out. Fast, accurate, and reliable attendance tracking.
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
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Attendance Analysis</h3>
                <p className="text-gray-600">
                  Get instant insights into attendance patterns, late arrivals, and early departures with clear dashboards.
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
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Geolocation Tracking</h3>
                <p className="text-gray-600">
                  Ensure employees are checking in from the correct location with geolocation verification.
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
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Staff Management</h3>
                <p className="text-gray-600">
                  Manage attendance across multiple teams and departments from a single dashboard.
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
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Automated Reports</h3>
                <p className="text-gray-600">
                  Generate detailed attendance reports for payroll and management reviews with just a few clicks.
                </p>
              </div>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7AE2CF]">
              <div className="p-6">
                <div className="bg-[#06202B] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7AE2CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Shift Management</h3>
                <p className="text-gray-600">
                  Easily manage different shifts and schedules for your employees.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Karmanishth Works</h2>
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
                <h3 className="text-xl font-bold mb-3">Get Attendance Insights</h3>
                <p className="text-gray-200">
                  View real-time attendance data, generate reports, and manage your workforce efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#F5EEDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#06202B] mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-[#077A7D] max-w-2xl mx-auto">
              Choose the plan that fits your organizations needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7AE2CF] transform hover:scale-105 transition-transform">
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Free Plan (14 Days Trial)</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#077A7D]">₹0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Unlimited Employees</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Geolocation-Based Attendance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Advanced Attendance Analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Monthly & Weekly Reports</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Staff Management Dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Shifts and Schedule Management</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Leave and Overtime Tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Automated Reports and Exports</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Smart Alerts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Attendance Support</span>
                  </li>
                </ul>
                <Link href="https://karamanishth.sharmaindustry.in/signup" className="w-full bg-[#06202B] hover:bg-[#0D3A4A] text-white py-3 rounded-md transition-colors block text-center">
                  Start Free Trial
                </Link>
              </div>
            </div>
            
            {/* Paid Plan */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[#077A7D] transform hover:scale-105 transition-transform relative">
              <div className="absolute top-0 right-0 bg-[#077A7D] text-white text-xs font-bold px-3 py-1 transform translate-x-2 -translate-y-2 rotate-12">
                BEST VALUE
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#06202B] mb-2">Paid Plan (₹10/month/per employee)</h3>
                <p className="text-gray-600 mb-6">Yearly subscription for growing businesses</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#077A7D]">₹10</span>
                  <span className="text-gray-500">/month*/per employee*</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">*Billed annually at ₹120</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Unlimited Employees</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Geolocation-Based Attendance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Advanced Attendance Analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Monthly & Weekly Reports</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Staff Management Dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Shifts and Schedule Management</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Leave and Overtime Tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Automated Reports and Exports</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Smart Alerts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#7AE2CF] mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Priority Attendance Support</span>
                  </li>
                </ul>
                <Link href="https://karamanishth.sharmaindustry.in/signup" className="w-full bg-[#077A7D] hover:bg-[#065E60] text-white py-3 rounded-md transition-colors font-bold block text-center">
                  Subscribe Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#06202B] text-[#F5EEDD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Your Attendance Management?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join businesses that trust Karmanishth for accurate, efficient employee attendance tracking.
          </p>
          <Link href="https://karamanishth.sharmaindustry.in/signup" className="bg-[#7AE2CF] hover:bg-[#5ECCB7] text-[#06202B] px-8 py-4 rounded-md transition-colors font-bold text-lg inline-block">
            Start Your Free 14-Day Trial
          </Link>
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
                    <p className="text-gray-600">pathshala.sharmaindustry@gmail.com</p>
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
                    <p className="text-gray-600">+91 7415253798</p>
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
                    <h4 className="font-bold text-[#06202B]">social media handel</h4>
                    <p className="text-gray-600">pathshala_sharma_industry</p>
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

      {/* Simple Footer */}
      <footer className="bg-[#06202B] text-[#F5EEDD] py-6 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>All Rights Reserved to Sharma Industry</p>
        </div>
      </footer>
    </div>
  );
}