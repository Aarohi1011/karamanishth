'use client'
import React from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiDollarSign, FiEdit } from 'react-icons/fi';

const Profile = () => {
  const employeeData = {
    name: "Alexandra Chen",
    position: "Senior Frontend Developer & Data Analyst",
    email: "alex.chen@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, Silicon Valley, CA 94025",
    department: "Engineering & Analytics",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Data Visualization", "SQL", "Python"],
    salary: "$145,000",
    experience: "20+ years Frontend, 25+ years Data Analysis",
    bio: "Seasoned frontend developer with extensive data analysis experience, creating beautiful, data-driven interfaces that tell compelling stories through visualization and interactivity."
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
                  {employeeData.name.charAt(0)}
                </div>
                <button className="absolute bottom-2 right-2 bg-[#DDA853] text-white p-2 rounded-full hover:bg-[#F5EEDD] hover:text-[#16404D] transition-all">
                  <FiEdit size={16} />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-[#F5EEDD] mb-1">{employeeData.name}</h2>
              <p className="text-[#A6CDC6] mb-6">{employeeData.position}</p>
              
              <div className="w-full space-y-4">
                <div className="flex items-center text-[#F5EEDD]">
                  <FiMail className="mr-3 text-[#7AE2CF]" />
                  <span>{employeeData.email}</span>
                </div>
                <div className="flex items-center text-[#F5EEDD]">
                  <FiPhone className="mr-3 text-[#7AE2CF]" />
                  <span>{employeeData.phone}</span>
                </div>
                <div className="flex items-center text-[#F5EEDD]">
                  <FiMapPin className="mr-3 text-[#7AE2CF]" />
                  <span>{employeeData.address}</span>
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
                <p className="text-[#16404D] mb-4">{employeeData.bio}</p>
                <div className="bg-[#F5EEDD] p-4 rounded-lg">
                  <p className="text-[#077A7D] font-medium">{employeeData.experience}</p>
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
                    {employeeData.department}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {employeeData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-[#7AE2CF] text-[#16404D] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
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
                      {employeeData.salary}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#A6CDC6] px-8 py-4 bg-[#F5EEDD] flex justify-end space-x-4">
            <button className="px-4 py-2 border border-[#077A7D] text-[#077A7D] rounded-lg hover:bg-[#077A7D] hover:text-[#F5EEDD] transition-colors">
              Download Profile
            </button>
            <button className="px-4 py-2 bg-[#077A7D] text-[#F5EEDD] rounded-lg hover:bg-[#16404D] transition-colors">
              Edit Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;