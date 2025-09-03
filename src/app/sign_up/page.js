'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiChevronRight, FiChevronLeft, FiPlus, FiX, FiUser, FiHome, FiBriefcase, FiPhone, FiMail } from 'react-icons/fi';
import Image from 'next/image';

const GettingStarted = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    businessName: '',
    businessType: '',

    // Step 2
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    contactName: '',
    phone: '',
    email: '',

    // Step 3
    employees: [{ name: '', phone: '' }]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [skipEmployees, setSkipEmployees] = useState(false);

  const businessTypes = [
    'Retail',
    'Restaurant',
    'Service',
    'Manufacturing',
    'Healthcare',
    'Technology',
    'Finance',
    'Education',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmployeeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEmployees = [...formData.employees];
    updatedEmployees[index] = {
      ...updatedEmployees[index],
      [name]: value
    };
    setFormData(prev => ({
      ...prev,
      employees: updatedEmployees
    }));
  };

  const addEmployee = () => {
    setFormData(prev => ({
      ...prev,
      employees: [...prev.employees, { name: '', phone: '' }]
    }));
  };

  const removeEmployee = (index) => {
    const updatedEmployees = [...formData.employees];
    updatedEmployees.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      employees: updatedEmployees
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare the data to send
      const businessData = {
        ...formData,
        employees: skipEmployees ? [] : formData.employees.filter(emp => emp.name && emp.phone)
      };

      const response = await fetch('/api/business/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to complete business setup');
      }

      // Success - redirect to dashboard or next step
      console.log('Business setup successful:', data);
      // router.push('/dashboard'); // Uncomment if you want to redirect

    } catch (error) {
      console.error('Submission error:', error);
      alert(error.message || 'An error occurred during submission');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06202B] to-[#16404D] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Get Started | Business Analytics</title>
        <meta name="description" content="Set up your business account in just a few steps" />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center">
            
             <Link href='/'>
            <div className="w-16 h-16 relative">
              <Image
                src="/favicon-196.png"
                alt="Company Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
            
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#F5EEDD]">
            Lets Get Started
          </h2>
          <p className="mt-2 text-center text-sm text-[#A6CDC6]">
            Set up your business account in just 3 simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mt-8">
          <div className="flex justify-between max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-[#7AE2CF] text-[#06202B]' : 'bg-[#16404D] text-[#A6CDC6]'} font-medium border-2 ${currentStep === step ? 'border-[#DDA853]' : 'border-transparent'}`}>
                  {step}
                </div>
                <div className={`mt-2 text-xs font-medium ${currentStep >= step ? 'text-[#7AE2CF]' : 'text-[#A6CDC6]'}`}>
                  {step === 1 ? 'Business' : step === 2 ? 'Contact' : 'Team'}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`h-1 w-full mx-2 ${currentStep >= 2 ? 'bg-[#7AE2CF]' : 'bg-[#16404D]'}`}></div>
              <div className={`h-1 w-full mx-2 ${currentStep >= 3 ? 'bg-[#7AE2CF]' : 'bg-[#16404D]'}`}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-[#FBF5DD] py-8 px-6 shadow-xl sm:rounded-lg sm:px-10 border border-[#DDA853]/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-[#06202B] mb-6 flex items-center">
                    <FiBriefcase className="mr-2 text-[#077A7D]" />
                    Business Information
                  </h3>

                  <div className="mb-4">
                    <label htmlFor="businessName" className="block text-sm font-medium text-[#16404D] mb-1">
                      Business Name *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 px-3 border"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-[#16404D] mb-1">
                      Business Type *
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      required
                      value={formData.businessType}
                      onChange={handleChange}
                      className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 px-3 border"
                    >
                      <option value="">Select your business type</option>
                      {businessTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.businessName || !formData.businessType}
                    className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-[#FBF5DD] bg-[#077A7D] hover:bg-[#16404D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AE2CF] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <FiChevronRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-[#06202B] mb-6 flex items-center">
                    <FiHome className="mr-2 text-[#077A7D]" />
                    Business Address
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-[#16404D] mb-1">
                        Street Address *
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 px-3 border"
                        placeholder="123 Main St"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-[#16404D] mb-1">
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 px-3 border"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-[#16404D] mb-1">
                        State/Province *
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 px-3 border"
                        placeholder="NY"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-[#16404D] mb-1">
                        Postal Code *
                      </label>
                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 px-3 border"
                        placeholder="10001"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-[#16404D] mb-1">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 px-3 border"
                      >
                        <option value="">Select country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="IN">India</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#06202B] mt-8 mb-6 flex items-center">
                    <FiUser className="mr-2 text-[#077A7D]" />
                    Primary Contact
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-[#16404D] mb-1">
                        Full Name *
                      </label>
                      <input
                        id="contactName"
                        name="contactName"
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 px-3 border"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-[#16404D] mb-1">
                        Role *
                      </label>
                      <select
                        id="role"
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 px-3 border"
                      >
                        <option value="">Select role</option>
                        <option value="Owner">Owner</option>
                        <option value="Manager">Manager</option>
                        <option value="Head">Head</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#16404D] mb-1">
                        Phone Number *
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="h-4 w-4 text-[#077A7D]" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full pl-8 sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 border"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-[#16404D] mb-1">
                        Email Address *
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-4 w-4 text-[#077A7D]" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full pl-8 sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 border"
                          placeholder="contact@business.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center justify-center py-2 px-6 border border-[#077A7D] shadow-sm text-sm font-medium rounded-md text-[#077A7D] bg-transparent hover:bg-[#F5EEDD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AE2CF] transition-colors duration-300"
                  >
                    <FiChevronLeft className="mr-2" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                  disabled={!formData.address || !formData.city || !formData.state || !formData.postalCode || !formData.country || !formData.contactName || !formData.phone || !formData.email || !formData.role}
                    className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-[#FBF5DD] bg-[#077A7D] hover:bg-[#16404D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AE2CF] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <FiChevronRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Employee Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-[#06202B] mb-6 flex items-center">
                    <FiUser className="mr-2 text-[#077A7D]" />
                    Team Members
                  </h3>

                  <div className="mb-6 p-4 bg-[#F5EEDD] rounded-lg border border-[#A6CDC6]">
                    <div className="flex items-center">
                      <input
                        id="skipEmployees"
                        name="skipEmployees"
                        type="checkbox"
                        checked={skipEmployees}
                        onChange={() => setSkipEmployees(!skipEmployees)}
                        className="focus:ring-[#7AE2CF] h-4 w-4 text-[#077A7D] border-[#A6CDC6] rounded"
                      />
                      <label htmlFor="skipEmployees" className="ml-3 text-sm text-[#16404D]">
                        I dont have employees to add right now
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-[#077A7D]">
                      You can always add employees later from your dashboard
                    </p>
                  </div>

                  {!skipEmployees && (
                    <div className="space-y-4">
                      {formData.employees.map((employee, index) => (
                        <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-end">
                          <div>
                            <label htmlFor={`employeeName-${index}`} className="block text-sm font-medium text-[#16404D] mb-1">
                              Employee Name {index > 0 && <span className="text-xs text-[#077A7D]">(Optional)</span>}
                            </label>
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="h-4 w-4 text-[#077A7D]" />
                              </div>
                              <input
                                id={`employeeName-${index}`}
                                name="name"
                                type="text"
                                value={employee.name}
                                onChange={(e) => handleEmployeeChange(index, e)}
                                className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full pl-8 sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 border"
                                placeholder="Employee name"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor={`employeePhone-${index}`} className="block text-sm font-medium text-[#16404D] mb-1">
                              Phone Number {index > 0 && <span className="text-xs text-[#077A7D]">(Optional)</span>}
                            </label>
                            <div className="flex">
                              <div className="relative rounded-md shadow-sm flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FiPhone className="h-4 w-4 text-[#077A7D]" />
                                </div>
                                <input
                                  id={`employeePhone-${index}`}
                                  name="phone"
                                  type="tel"
                                  value={employee.phone}
                                  onChange={(e) => handleEmployeeChange(index, e)}
                                  className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full pl-8 sm:text-sm border-[#A6CDC6] rounded-md bg-white text-[#16404D] py-2 border"
                                  placeholder="(123) 456-7890"
                                />
                              </div>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => removeEmployee(index)}
                                  className="ml-2 inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-[#DDA853] hover:bg-[#16404D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AE2CF]"
                                >
                                  <FiX className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={addEmployee}
                          className="inline-flex items-center px-3 py-2 border border-[#A6CDC6] rounded-md shadow-sm text-sm font-medium text-[#077A7D] bg-white hover:bg-[#F5EEDD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AE2CF]"
                        >
                          <FiPlus className="mr-2 h-4 w-4" />
                          Add Another Employee
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center justify-center py-2 px-6 border border-[#077A7D] shadow-sm text-sm font-medium rounded-md text-[#077A7D] bg-transparent hover:bg-[#F5EEDD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AE2CF] transition-colors duration-300"
                  >
                    <FiChevronLeft className="mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-[#FBF5DD] bg-[#077A7D] hover:bg-[#16404D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AE2CF] transition-colors duration-300"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Setting Up...
                      </>
                    ) : 'Complete Setup'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-[#A6CDC6]">
            <p className="text-xs text-[#16404D] text-center">
              By completing this setup, you agree to our <a href="#" className="text-[#077A7D] hover:text-[#16404D]">Terms of Service</a> and <a href="#" className="text-[#077A7D] hover:text-[#16404D]">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;