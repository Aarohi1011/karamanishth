'use client'
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState('pathshala');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Products', href: '#products' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '#contact' }
  ];

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with encrypted data storage and role-based access control.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Fast Performance',
      description: 'Optimized for speed with cloud-based infrastructure ensuring quick response times.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Comprehensive Reports',
      description: 'Generate detailed analytics and exportable reports for data-driven decision making.'
    }
  ];

  const socialLinks = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      ),
      href: '#'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      href: '#'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      href: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5EEDD]">
      <Head>
        <title>Sharma Industry | Innovative Software Solutions</title>
        <meta name="description" content="Modern software solutions for education and business management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 ${scrolled ? 'bg-[#06202B]/95 backdrop-blur-sm py-2 shadow-xl' : 'bg-[#06202B] py-4'} text-[#FBF5DD] transition-all duration-300`}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold flex items-center"
            >
              <span className="bg-[#077A7D] p-1 rounded mr-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </span>
              Sharma Industry
            </motion.div>
            
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link, index) => (
                <motion.a 
                  key={index}
                  href={link.href}
                  className="relative group hover:text-[#7AE2CF] transition"
                  whileHover={{ scale: 1.05 }}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7AE2CF] transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
            </div>
            
            <motion.button 
              className="md:hidden focus:outline-none"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-6 space-y-4 px-6">
                {navLinks.map((link, index) => (
                  <motion.a 
                    key={index}
                    href={link.href}
                    className="block py-2 hover:text-[#7AE2CF] transition"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-[#06202B] to-[#16404D] text-[#FBF5DD] pt-32 pb-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#7AE2CF]"
              style={{
                width: Math.random() * 20 + 5,
                height: Math.random() * 20 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Innovative <span className="text-[#7AE2CF]">Software</span> Solutions
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            Modern, scalable applications designed to streamline operations for education and business
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <motion.a 
              href="#products" 
              className="bg-[#077A7D] hover:bg-[#7AE2CF] text-white px-8 py-3 rounded-lg font-medium transition flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Products
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.a>
            
            <motion.a 
              href="#contact" 
              className="border-2 border-[#7AE2CF] text-[#7AE2CF] hover:bg-[#7AE2CF] hover:text-[#06202B] px-8 py-3 rounded-lg font-medium transition flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path 
              fill="#FBF5DD" 
              fillOpacity="1" 
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,106.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </header>

      {/* Products Section */}
      <section id="products" className="py-20 bg-[#FBF5DD] relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#077A7D] filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#DDA853] filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-[#06202B] mb-12"
          >
            Our <span className="text-[#077A7D]">Products</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex rounded-md shadow-sm overflow-hidden">
              <button
                onClick={() => setActiveTab('pathshala')}
                className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${activeTab === 'pathshala' ? 'bg-[#077A7D] text-white' : 'bg-[#A6CDC6] text-[#06202B] hover:bg-[#7AE2CF]'}`}
              >
                Pathshala
              </button>
              <button
                onClick={() => setActiveTab('karmanishth')}
                className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${activeTab === 'karmanishth' ? 'bg-[#077A7D] text-white' : 'bg-[#A6CDC6] text-[#06202B] hover:bg-[#7AE2CF]'}`}
              >
                Karmanishth
              </button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'pathshala' ? (
                <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                  <div className="md:flex">
                    <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-[#077A7D] to-[#7AE2CF] text-white relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/10"></div>
                      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/10"></div>
                      
                      <h3 className="text-3xl font-bold mb-4 relative z-10">Pathshala</h3>
                      <p className="text-xl mb-6 relative z-10">Comprehensive School ERP Management System</p>
                      <ul className="space-y-3 relative z-10">
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
                      <motion.button 
                        className="mt-8 bg-white text-[#077A7D] hover:bg-[#FBF5DD] px-6 py-3 rounded-lg font-medium transition relative z-10 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Learn More
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.button>
                    </div>
                    <div className="md:w-1/2 p-8 md:p-12">
                      <h4 className="text-xl font-bold text-[#06202B] mb-4">Key Modules</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            title: 'Attendance',
                            description: 'Track and analyze student and teacher attendance'
                          },
                          {
                            title: 'Lecture Management',
                            description: 'Automated scheduling with QR check-ins'
                          },
                          {
                            title: 'Result Management',
                            description: 'Complete result processing and analysis'
                          },
                          {
                            title: 'School Configuration',
                            description: 'Customize settings for your institution'
                          }
                        ].map((item, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-[#F5EEDD] p-4 rounded-lg hover:shadow-md transition"
                            whileHover={{ y: -5 }}
                          >
                            <div className="w-8 h-8 bg-[#077A7D]/10 rounded-full flex items-center justify-center mb-2">
                              <svg className="w-4 h-4 text-[#077A7D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h5 className="font-bold text-[#077A7D] mb-2">{item.title}</h5>
                            <p className="text-sm text-[#16404D]">{item.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                  <div className="md:flex">
                    <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-[#077A7D] to-[#7AE2CF] text-white relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/10"></div>
                      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/10"></div>
                      
                      <h3 className="text-3xl font-bold mb-4 relative z-10">Karmanishth</h3>
                      <p className="text-xl mb-6 relative z-10">Employee Management System for SMEs</p>
                      <ul className="space-y-3 relative z-10">
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
                      <motion.button 
                        className="mt-8 bg-white text-[#077A7D] hover:bg-[#FBF5DD] px-6 py-3 rounded-lg font-medium transition relative z-10 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Learn More
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.button>
                    </div>
                    <div className="md:w-1/2 p-8 md:p-12">
                      <h4 className="text-xl font-bold text-[#06202B] mb-4">Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            title: 'Attendance Tracking',
                            description: "Monitor who's on time, late, or absent"
                          },
                          {
                            title: 'Analytics Dashboard',
                            description: 'Visualize employee attendance trends'
                          },
                          {
                            title: 'Custom Reports',
                            description: 'Generate detailed attendance reports'
                          },
                          {
                            title: 'Multi-location',
                            description: 'Manage multiple shops/offices'
                          }
                        ].map((item, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-[#F5EEDD] p-4 rounded-lg hover:shadow-md transition"
                            whileHover={{ y: -5 }}
                          >
                            <div className="w-8 h-8 bg-[#077A7D]/10 rounded-full flex items-center justify-center mb-2">
                              <svg className="w-4 h-4 text-[#077A7D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h5 className="font-bold text-[#077A7D] mb-2">{item.title}</h5>
                            <p className="text-sm text-[#16404D]">{item.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full bg-[#7AE2CF] filter blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-[#DDA853] filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-[#06202B] mb-12"
          >
            Advanced <span className="text-[#077A7D]">Features</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#FBF5DD] p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                whileHover={{ y: -10 }}
              >
                {/* Decorative element */}
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#077A7D]/10"></div>
                
                <div className="w-12 h-12 bg-[#077A7D] rounded-full flex items-center justify-center text-white mb-4 relative">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#06202B] mb-3 relative">{feature.title}</h3>
                <p className="text-[#16404D] relative">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#077A7D] to-[#16404D] text-[#FBF5DD]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "Happy Clients" },
              { number: "100K+", label: "Daily Users" },
              { number: "24/7", label: "Support" },
              { number: "99.9%", label: "Uptime" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6"
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#F5EEDD]">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-[#06202B] mb-12"
          >
            What Our <span className="text-[#077A7D]">Clients</span> Say
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Pathshala has transformed our school administration. Everything is now streamlined and efficient.",
                name: "Dr. Ramesh Sharma",
                role: "Principal, Delhi Public School"
              },
              {
                quote: "Karmanishth helped us reduce employee absenteeism by 40% in just 3 months. Incredible results!",
                name: "Priya Patel",
                role: "HR Manager, TechSolutions Inc."
              },
              {
                quote: "The analytics dashboard provides insights we never had before. Data-driven decisions are now easy.",
                name: "Amit Kumar",
                role: "Operations Head, Retail Chain"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="text-[#16404D] mb-6">
                  <svg className="w-8 h-8 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-[#06202B] mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#077A7D] flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-[#06202B]">{testimonial.name}</div>
                    <div className="text-sm text-[#077A7D]">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#06202B] text-[#FBF5DD] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
          <div className="absolute top-20 right-20 w-60 h-60 rounded-full bg-[#7AE2CF] filter blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#DDA853] filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Get In <span className="text-[#7AE2CF]">Touch</span>
          </motion.h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="md:flex">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="md:w-1/2 mb-8 md:mb-0 md:pr-8"
              >
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
                
                <div className="mt-8">
                  <h4 className="text-xl font-bold mb-4">Visit Us</h4>
                  <div className="bg-[#16404D] rounded-xl overflow-hidden h-48 relative">
                    {/* This would be replaced with an actual map component */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-16 h-16 text-[#7AE2CF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <form className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="name" className="block mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 rounded bg-[#16404D] border border-[#077A7D] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF] transition" 
                      placeholder="Your name"
                    />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 rounded bg-[#16404D] border border-[#077A7D] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF] transition" 
                      placeholder="Your email"
                    />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="message" className="block mb-1">Message</label>
                    <textarea 
                      id="message" 
                      rows="4" 
                      className="w-full px-4 py-3 rounded bg-[#16404D] border border-[#077A7D] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF] transition" 
                      placeholder="Your message"
                    ></textarea>
                  </motion.div>
                  
                  <motion.button 
                    type="submit" 
                    className="bg-[#077A7D] hover:bg-[#7AE2CF] text-white px-6 py-3 rounded-lg font-medium transition w-full flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    Send Message
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#16404D] text-[#A6CDC6] py-12">
        <div className="container mx-auto px-6">
          <div className="md:flex md:justify-between md:items-start">
            <div className="mb-8 md:mb-0">
              <div className="text-xl font-bold text-[#FBF5DD] mb-2 flex items-center">
                <span className="bg-[#077A7D] p-1 rounded mr-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </span>
                Sharma Industry
              </div>
              <p className="mt-2 max-w-xs">Innovative Software Solutions for education and business management</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-bold text-[#FBF5DD] mb-4">Products</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-[#7AE2CF] transition">Pathshala</a></li>
                  <li><a href="#" className="hover:text-[#7AE2CF] transition">Karmanishth</a></li>
                  <li><a href="#" className="hover:text-[#7AE2CF] transition">Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-[#FBF5DD] mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-[#7AE2CF] transition">About Us</a></li>
                  <li><a href="#" className="hover:text-[#7AE2CF] transition">Careers</a></li>
                  <li><a href="#" className="hover:text-[#7AE2CF] transition">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-[#FBF5DD] mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-[#7AE2CF] transition">Help Center</a></li>
                  <li><a href="#" className="hover:text-[#7AE2CF] transition">Documentation</a></li>
                  <li><a href="#" className="hover:text-[#7AE2CF] transition">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#077A7D]/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Sharma Industry. All rights reserved.
            </div>
            
            <div className="flex space-x-6">
              {socialLinks.map((link, index) => (
                <motion.a 
                  key={index}
                  href={link.href}
                  className="hover:text-[#7AE2CF] transition"
                  whileHover={{ y: -3 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}