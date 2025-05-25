'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: '',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(formData);
      setIsLoading(false);
    }, 1500);
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
        <title>Sign Up | Data Analytics Portal</title>
        <meta name="description" content="Create an account to access the data analytics dashboard" />
      </Head>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex justify-center">
          <svg className="w-16 h-16 text-[#7AE2CF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.227 15.6363 19.2849 15.9606C19.3428 16.2849 19.4962 16.5844 19.725 16.8199C20.1075 17.2099 20.6988 17.2305 21.1054 16.8687C21.8741 16.1969 22.5 15.3401 22.5 14.3947C22.5 13.4494 21.8741 12.5926 21.1054 11.9208C20.6988 11.559 20.1075 11.5796 19.725 11.9696C19.4962 12.2051 19.3428 12.5046 19.2849 12.8289C19.227 13.1532 19.2669 13.4879 19.4 13.7895" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.6 15C4.73314 15.3016 4.77301 15.6363 4.71511 15.9606C4.65721 16.2849 4.50381 16.5844 4.275 16.8199C3.89254 17.2099 3.30122 17.2305 2.89459 16.8687C2.12589 16.1969 1.5 15.3401 1.5 14.3947C1.5 13.4494 2.12589 12.5926 2.89459 11.9208C3.30122 11.559 3.89254 11.5796 4.275 11.9696C4.50381 12.2051 4.65721 12.5046 4.71511 12.8289C4.77301 13.1532 4.73314 13.4879 4.6 13.7895" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 4.6C15.3016 4.73314 15.6363 4.77301 15.9606 4.71511C16.2849 4.65721 16.5844 4.50381 16.8199 4.275C17.2099 3.89254 17.2305 3.30122 16.8687 2.89459C16.1969 2.12589 15.3401 1.5 14.3947 1.5C13.4494 1.5 12.5926 2.12589 11.9208 2.89459C11.559 3.30122 11.5796 3.89254 11.9696 4.275C12.2051 4.50381 12.5046 4.65721 12.8289 4.71511C13.1532 4.77301 13.4879 4.73314 13.7895 4.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 19.4C15.3016 19.2669 15.6363 19.227 15.9606 19.2849C16.2849 19.3428 16.5844 19.4962 16.8199 19.725C17.2099 20.1075 17.2305 20.6988 16.8687 21.1054C16.1969 21.8741 15.3401 22.5 14.3947 22.5C13.4494 22.5 12.5926 21.8741 11.9208 21.1054C11.559 20.6988 11.5796 20.1075 11.9696 19.725C12.2051 19.4962 12.5046 19.3428 12.8289 19.2849C13.1532 19.227 13.4879 19.2669 13.7895 19.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#F5EEDD]">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-[#A6CDC6]">
          Join our data analytics platform and unlock powerful insights
        </p>
        
        {/* Progress Steps */}
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-md">
            <div className="flex justify-between">
              {[1, 2].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-[#7AE2CF] text-[#06202B]' : 'bg-[#A6CDC6] text-[#16404D]'} font-medium`}>
                    {step}
                  </div>
                  <div className={`mt-2 text-xs font-medium ${currentStep >= step ? 'text-[#7AE2CF]' : 'text-[#A6CDC6]'}`}>
                    {step === 1 ? 'Account' : 'Profile'}
                  </div>
                </div>
              ))}
              <div className="flex-1 flex items-center">
                <div className={`h-1 w-full mx-2 ${currentStep >= 2 ? 'bg-[#7AE2CF]' : 'bg-[#A6CDC6]'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-[#FBF5DD] py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-[#DDA853]/30">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#16404D]">
                      First Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-[#F5EEDD] text-[#16404D] py-2 px-3 border"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#16404D]">
                      Last Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-[#F5EEDD] text-[#16404D] py-2 px-3 border"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#16404D]">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-[#077A7D]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full pl-10 sm:text-sm border-[#A6CDC6] rounded-md bg-[#F5EEDD] text-[#16404D] py-2 border"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#16404D]">
                      Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-[#077A7D]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full pl-10 sm:text-sm border-[#A6CDC6] rounded-md bg-[#F5EEDD] text-[#16404D] py-2 border pr-10"
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        <svg className="h-5 w-5 text-[#077A7D]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          {showPassword ? (
                            <>
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </>
                          ) : (
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          )}
                        </svg>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-[#077A7D]">
                      Minimum 8 characters with at least one number
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#16404D]">
                      Confirm Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-[#077A7D]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full pl-10 sm:text-sm border-[#A6CDC6] rounded-md bg-[#F5EEDD] text-[#16404D] py-2 border pr-10"
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <svg className="h-5 w-5 text-[#077A7D]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          {showConfirmPassword ? (
                            <>
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </>
                          ) : (
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          )}
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-[#FBF5DD] bg-[#077A7D] hover:bg-[#16404D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AE2CF] transition-colors duration-300"
                  >
                    Continue
                    <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-[#16404D]">
                    Company
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={formData.company}
                      onChange={handleChange}
                      className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-[#F5EEDD] text-[#16404D] py-2 px-3 border"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-[#16404D]">
                    Job Title
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      type="text"
                      autoComplete="organization-title"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full sm:text-sm border-[#A6CDC6] rounded-md bg-[#F5EEDD] text-[#16404D] py-2 px-3 border"
                      placeholder="Your role"
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      required
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="focus:ring-[#7AE2CF] h-4 w-4 text-[#077A7D] border-[#A6CDC6] rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="acceptTerms" className="font-medium text-[#16404D]">
                      I agree to the <a href="#" className="text-[#077A7D] hover:text-[#16404D]">Terms of Service</a> and <a href="#" className="text-[#077A7D] hover:text-[#16404D]">Privacy Policy</a>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex justify-center py-2 px-6 border border-[#077A7D] shadow-sm text-sm font-medium rounded-md text-[#077A7D] bg-transparent hover:bg-[#F5EEDD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AE2CF] transition-colors duration-300"
                  >
                    <svg className="mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-[#FBF5DD] bg-[#077A7D] hover:bg-[#16404D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AE2CF] transition-colors duration-300"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#A6CDC6]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#FBF5DD] text-[#16404D]">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-[#A6CDC6] rounded-md shadow-sm bg-[#F5EEDD] text-sm font-medium text-[#16404D] hover:bg-[#FBF5DD]"
                >
                  <svg className="w-5 h-5 text-[#077A7D]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-[#A6CDC6] rounded-md shadow-sm bg-[#F5EEDD] text-sm font-medium text-[#16404D] hover:bg-[#FBF5DD]"
                >
                  <svg className="w-5 h-5 text-[#077A7D]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-[#16404D]">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-[#077A7D] hover:text-[#16404D]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;