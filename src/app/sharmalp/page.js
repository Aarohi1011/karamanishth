'use client'
import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('pathshala');

  return (
    <div className="min-h-screen bg-[#F5EEDD]">
      <Head>
        <title>Sharma Industry | Innovative Software Solutions</title>
        <meta name="description" content="Modern software solutions for education and business management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-[#06202B] text-[#FBF5DD] shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">Sharma Industry</div>
            <div className="hidden md:flex space-x-8">
              <a href="#products" className="hover:text-[#7AE2CF] transition">Products</a>
              <a href="#features" className="hover:text-[#7AE2CF] transition">Features</a>
              <a href="#contact" className="hover:text-[#7AE2CF] transition">Contact</a>
            </div>
            <button className="md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#06202B] to-[#16404D] text-[#FBF5DD] py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Innovative Software Solutions</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Modern, scalable applications designed to streamline operations for education and business
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#products" className="bg-[#077A7D] hover:bg-[#7AE2CF] text-white px-8 py-3 rounded-lg font-medium transition">
              Explore Products
            </a>
            <a href="#contact" className="border-2 border-[#7AE2CF] text-[#7AE2CF] hover:bg-[#7AE2CF] hover:text-[#06202B] px-8 py-3 rounded-lg font-medium transition">
              Contact Us
            </a>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <section id="products" className="py-20 bg-[#FBF5DD]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#06202B] mb-12">Our Products</h2>
          
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setActiveTab('pathshala')}
                className={`px-6 py-3 text-sm font-medium rounded-l-lg ${activeTab === 'pathshala' ? 'bg-[#077A7D] text-white' : 'bg-[#A6CDC6] text-[#06202B] hover:bg-[#7AE2CF]'}`}
              >
                Pathshala
              </button>
              <button
                onClick={() => setActiveTab('karmanishth')}
                className={`px-6 py-3 text-sm font-medium rounded-r-lg ${activeTab === 'karmanishth' ? 'bg-[#077A7D] text-white' : 'bg-[#A6CDC6] text-[#06202B] hover:bg-[#7AE2CF]'}`}
              >
                Karmanishth
              </button>
            </div>
          </div>

          {activeTab === 'pathshala' ? (
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-[#077A7D] to-[#7AE2CF] text-white">
                  <h3 className="text-3xl font-bold mb-4">Pathshala</h3>
                  <p className="text-xl mb-6">Comprehensive School ERP Management System</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Streamline attendance, lectures, and results</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Automated scheduling and substitutions</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Comprehensive analytics and reporting</span>
                    </li>
                  </ul>
                  <button className="mt-8 bg-white text-[#077A7D] hover:bg-[#FBF5DD] px-6 py-3 rounded-lg font-medium transition">
                    Learn More
                  </button>
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <h4 className="text-xl font-bold text-[#06202B] mb-4">Key Modules</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#F5EEDD] p-4 rounded-lg">
                      <h5 className="font-bold text-[#077A7D] mb-2">Attendance</h5>
                      <p className="text-sm text-[#16404D]">Track and analyze student and teacher attendance</p>
                    </div>
                    <div className="bg-[#F5EEDD] p-4 rounded-lg">
                      <h5 className="font-bold text-[#077A7D] mb-2">Lecture Management</h5>
                      <p className="text-sm text-[#16404D]">Automated scheduling with QR check-ins</p>
                    </div>
                    <div className="bg-[#F5EEDD] p-4 rounded-lg">
                      <h5 className="font-bold text-[#077A7D] mb-2">Result Management</h5>
                      <p className="text-sm text-[#16404D]">Complete result processing and analysis</p>
                    </div>
                    <div className="bg-[#F5EEDD] p-4 rounded-lg">
                      <h5 className="font-bold text-[#077A7D] mb-2">School Configuration</h5>
                      <p className="text-sm text-[#16404D]">Customize settings for your institution</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-[#077A7D] to-[#7AE2CF] text-white">
                  <h3 className="text-3xl font-bold mb-4">Karmanishth</h3>
                  <p className="text-xl mb-6">Employee Management System for SMEs</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Monitor employee punctuality and attendance</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Real-time tracking of check-ins/check-outs</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Centralized dashboard for business owners</span>
                    </li>
                  </ul>
                  <button className="mt-8 bg-white text-[#077A7D] hover:bg-[#FBF5DD] px-6 py-3 rounded-lg font-medium transition">
                    Learn More
                  </button>
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <h4 className="text-xl font-bold text-[#06202B] mb-4">Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#F5EEDD] p-4 rounded-lg">
                      <h5 className="font-bold text-[#077A7D] mb-2">Attendance Tracking</h5>
                      <p className="text-sm text-[#16404D]">Monitor who&apos;s on time, late, or absent</p>
                    </div>
                    <div className="bg-[#F5EEDD] p-4 rounded-lg">
                      <h5 className="font-bold text-[#077A7D] mb-2">Analytics Dashboard</h5>
                      <p className="text-sm text-[#16404D]">Visualize employee attendance trends</p>
                    </div>
                    <div className="bg-[#F5EEDD] p-4 rounded-lg">
                      <h5 className="font-bold text-[#077A7D] mb-2">Custom Reports</h5>
                      <p className="text-sm text-[#16404D]">Generate detailed attendance reports</p>
                    </div>
                    <div className="bg-[#F5EEDD] p-4 rounded-lg">
                      <h5 className="font-bold text-[#077A7D] mb-2">Multi-location</h5>
                      <p className="text-sm text-[#16404D]">Manage multiple shops/offices</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#06202B] mb-12">Advanced Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#FBF5DD] p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-[#077A7D] rounded-full flex items-center justify-center text-white mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#06202B] mb-3">Secure & Reliable</h3>
              <p className="text-[#16404D]">Enterprise-grade security with encrypted data storage and role-based access control.</p>
            </div>
            
            <div className="bg-[#FBF5DD] p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-[#077A7D] rounded-full flex items-center justify-center text-white mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#06202B] mb-3">Fast Performance</h3>
              <p className="text-[#16404D]">Optimized for speed with cloud-based infrastructure ensuring quick response times.</p>
            </div>
            
            <div className="bg-[#FBF5DD] p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-[#077A7D] rounded-full flex items-center justify-center text-white mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#06202B] mb-3">Comprehensive Reports</h3>
              <p className="text-[#16404D]">Generate detailed analytics and exportable reports for data-driven decision making.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#06202B] text-[#FBF5DD]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="md:flex">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-1 mr-3 text-[#7AE2CF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>contact@sharmaindustry.com</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-1 mr-3 text-[#7AE2CF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+91 XXXXX XXXXX</span>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block mb-1">Name</label>
                    <input type="text" id="name" className="w-full px-4 py-2 rounded bg-[#16404D] border border-[#077A7D] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input type="email" id="email" className="w-full px-4 py-2 rounded bg-[#16404D] border border-[#077A7D] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block mb-1">Message</label>
                    <textarea id="message" rows="4" className="w-full px-4 py-2 rounded bg-[#16404D] border border-[#077A7D] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"></textarea>
                  </div>
                  <button type="submit" className="bg-[#077A7D] hover:bg-[#7AE2CF] text-white px-6 py-3 rounded-lg font-medium transition w-full">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#16404D] text-[#A6CDC6] py-8">
        <div className="container mx-auto px-6">
          <div className="md:flex md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold text-[#FBF5DD]">Sharma Industry</div>
              <p className="mt-1">Innovative Software Solutions</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[#7AE2CF] transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="hover:text-[#7AE2CF] transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="hover:text-[#7AE2CF] transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} Sharma Industry. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}