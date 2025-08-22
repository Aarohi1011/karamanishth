'use client'

import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiDollarSign, FiEdit, FiCalendar } from 'react-icons/fi';
import { auth } from '@/app/lib/auth';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await auth();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#06202B] to-[#16404D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7AE2CF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#F5EEDD]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#06202B] to-[#16404D] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#DDA853] text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#077A7D] text-[#F5EEDD] rounded-lg hover:bg-[#16404D] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#06202B] to-[#16404D] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#DDA853] text-xl">No user data found</p>
        </div>
      </div>
    );
  }

  // Default values for missing data
  const profileData = {
    name: userData.name || "Not Provided",
    position: userData.role || "Not Specified",
    email: userData.email || "Not Provided",
    phone: userData.phone || "Not Provided",
    address: userData.address || "Not Provided",
    department: userData.businessName || "Not Specified",
    skills: userData.skills || [],
    salary: userData.salary || "Not Specified",
    joinDate: formatDate(userData.joinDate?.$date || userData.createdAt?.$date),
    experience: userData.experience || "Not Specified",
    bio: userData.bio || "No bio available for this user."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06202B] to-[#16404D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#F5EEDD] mb-2">Employee Profile</h1>
          <p className="text-[#A6CDC6]">Comprehensive professional overview</p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#FBF5DD] rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Avatar & Basic Info */}
            <div className="md:w-1/3 bg-gradient-to-b from-[#077A7D] to-[#16404D] p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full bg-[#7AE2CF] flex items-center justify-center text-[#16404D] text-6xl font-bold">
                  {profileData.name.charAt(0)}
                </div>
                <button className="absolute bottom-2 right-2 bg-[#DDA853] text-white p-2 rounded-full hover:bg-[#F5EEDD] hover:text-[#16404D] transition-all">
                  <FiEdit size={16} />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-[#F5EEDD] mb-1">{profileData.name}</h2>
              <p className="text-[#A6CDC6] mb-6">{profileData.position}</p>
              
              <div className="w-full space-y-4">
                <div className="flex items-center text-[#F5EEDD]">
                  <FiMail className="mr-3 text-[#7AE2CF]" />
                  <span className="truncate">{profileData.email}</span>
                </div>
                <div className="flex items-center text-[#F5EEDD]">
                  <FiPhone className="mr-3 text-[#7AE2CF]" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center text-[#F5EEDD]">
                  <FiMapPin className="mr-3 text-[#7AE2CF]" />
                  <span>{profileData.address}</span>
                </div>
                <div className="flex items-center text-[#F5EEDD]">
                  <FiCalendar className="mr-3 text-[#7AE2CF]" />
                  <span>Joined: {profileData.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Detailed Info */}
            <div className="md:w-2/3 p-8">
              {/* Experience & Bio */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#16404D] mb-4 flex items-center">
                  <FiUser className="mr-2 text-[#077A7D]" />
                  Professional Overview
                </h3>
                <p className="text-[#16404D] mb-4">{profileData.bio}</p>
                <div className="bg-[#F5EEDD] p-4 rounded-lg">
                  <p className="text-[#077A7D] font-medium">{profileData.experience}</p>
                </div>
              </div>

              {/* Department & Skills */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#16404D] mb-4 flex items-center">
                  <FiBriefcase className="mr-2 text-[#077A7D]" />
                  Role & Skills
                </h3>
                <div className="mb-4">
                  <span className="inline-block bg-[#077A7D] text-[#F5EEDD] px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {profileData.department}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-[#7AE2CF] text-[#16404D] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-[#16404D]">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Salary */}
              <div>
                <h3 className="text-xl font-semibold text-[#16404D] mb-4 flex items-center">
                  <FiDollarSign className="mr-2 text-[#077A7D]" />
                  Compensation
                </h3>
                <div className="bg-gradient-to-r from-[#F5EEDD] to-[#A6CDC6] p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#16404D] font-medium">Annual Salary</p>
                      <p className="text-sm text-[#077A7D]">Base compensation</p>
                    </div>
                    <span className="text-2xl font-bold text-[#16404D]">
                      {profileData.salary}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 
          <div className="border-t border-[#A6CDC6] px-8 py-4 bg-[#F5EEDD] flex justify-end space-x-4">
            <button className="px-4 py-2 border border-[#077A7D] text-[#077A7D] rounded-lg hover:bg-[#077A7D] hover:text-[#F5EEDD] transition-colors">
              Download Profile
            </button>
            <button className="px-4 py-2 bg-[#077A7D] text-[#F5EEDD] rounded-lg hover:bg-[#16404D] transition-colors">
              Edit Information
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;