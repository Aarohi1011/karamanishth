'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch('/api/employee/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        rememberMe,
      }),
    });

    const data = await response.json();
    console.log(data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
      if (data.role) {
        if (data.role === 'Staff') {
          router.push('/employee');
        }
        if (data.role === 'Owner' || data.role === " Manager" || data.role==="Head") {
          router.push('/admin');
        }
      }
    console.log('Login successful:', data);
    // Optionally redirect or store token
    // localStorage.setItem('token', data.token);
    // router.push('/dashboard');

  } catch (error) {
    console.error('Login failed:', error.message);
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06202B] to-[#16404D] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Login </title>
        <meta name="description" content="Login" />
      </Head>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {/* Replaced the SVG with your logo */}
          <div className="w-16 h-16 relative">
            <Image
              src="/favicon-196.png"
              alt="Company Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#F5EEDD]">
          Login
        </h2>
        <p className="mt-2 text-center text-sm text-[#A6CDC6]">
          Login in to access your analytics dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FBF5DD] py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-[#DDA853]/30">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full pl-10 sm:text-sm border-[#A6CDC6] rounded-md bg-[#F5EEDD] text-[#16404D] py-3 border"
                  placeholder="you@example.com"
                />
              </div>
            </div>

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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-[#7AE2CF] focus:border-[#7AE2CF] block w-full pl-10 sm:text-sm border-[#A6CDC6] rounded-md bg-[#F5EEDD] text-[#16404D] py-3 border pr-10"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#077A7D] focus:ring-[#7AE2CF] border-[#A6CDC6] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#16404D]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#077A7D] hover:text-[#16404D]">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#FBF5DD] bg-[#077A7D] hover:bg-[#16404D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7AE2CF] transition-colors duration-300"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 极速4">
                      <circle className="opacity-25" cx="12" cy="12" r="极速0" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </div>
          </form>

         
          
          <div className="mt-6 text-center">
            <p className="text-sm text-[#16404D]">
                {"Don't have an account? "}
              <a href="#" className="font-medium text-[#077A7D] hover:text-[#16404D]">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;