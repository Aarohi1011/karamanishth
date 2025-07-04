'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    department: '',
    role: '',
    salary: '',
    skills: '',
    bio: '',
    experience: ''
  });

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/business/getemployee');
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        setEmployees(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/employee/add_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(',').map(skill => skill.trim()),
          experience: formData.experience || '0' // Default to 0 if not provided
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to add employee');
      }

      const newEmployee = await response.json();
      
      // Update local state with the new employee
      setEmployees([...employees, newEmployee.data]);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        position: '',
        department: '',
        role: '',
        salary: '',
        skills: '',
        bio: '',
        experience: ''
      });
      
      setShowForm(false);
      
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#06202B] to-[#16404D] flex items-center justify-center">
        <div className="text-[#F5EEDD]">Loading employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#06202B] to-[#16404D] flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06202B] to-[#16404D] p-4 md:p-8">
      <Head>
        <title>Employee Management System</title>
        <meta name="description" content="Modern employee management dashboard" />
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#F5EEDD]">Employee Management</h1>
          <p className="text-[#A6CDC6] mt-2">Manage your team members efficiently</p>
        </header>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full bg-[#16404D] border border-[#077A7D] rounded-lg py-2 px-4 text-[#F5EEDD] placeholder-[#A6CDC6] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-[#A6CDC6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#DDA853] hover:bg-[#c09548] text-[#06202B] font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Add Employee
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Employee Table */}
        <div className="bg-[#16404D] rounded-xl shadow-lg overflow-hidden">
          {employees.length === 0 ? (
            <div className="p-8 text-center text-[#A6CDC6]">
              No employees found. Add your first employee to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#077A7D] text-[#FBF5DD]">
                  <tr>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Position</th>
                    <th className="py-3 px-4 text-left">Department</th>
                    <th className="py-3 px-4 text-left">Role</th>
                    <th className="py-3 px-4 text-left">Join Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0A5560]">
                  {employees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-[#0E6774] transition duration-150">
                      <td className="py-4 px-4 text-[#F5EEDD]">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#077A7D] flex items-center justify-center text-[#FBF5DD] font-semibold mr-3">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-[#A6CDC6]">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#F5EEDD]">{employee.position}</td>
                      <td className="py-4 px-4 text-[#F5EEDD]">{employee.department}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.role === 'Management' ? 'bg-[#DDA853] text-[#06202B]' :
                          employee.role === 'Developer' ? 'bg-[#7AE2CF] text-[#06202B]' :
                          'bg-[#A6CDC6] text-[#06202B]'
                        }`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#F5EEDD]">
                        {new Date(employee.joinDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-[#7AE2CF] hover:text-[#5ac7b3] mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                        <button className="text-[#DDA853] hover:text-[#c09548]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Floating Add Employee Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#FBF5DD] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#06202B]">Add New Employee</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-[#077A7D] hover:text-[#055b5e]"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#077A7D] border-b border-[#A6CDC6] pb-2">
                        Basic Information
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-[#06202B] mb-1">Full Name*</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white border border-[#A6CDC6] rounded-lg py-2 px-4 text-[#06202B] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#06202B] mb-1">Email*</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white border border-[#A6CDC6] rounded-lg py-2 px-4 text-[#06202B] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#06202B] mb-1">Phone*</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white border border-[#A6CDC6] rounded-lg py-2 px-4 text-[#06202B] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#06202B] mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#A6CDC6] rounded-lg py-2 px-4 text-[#06202B] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                        />
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#077A7D] border-b border-[#A6CDC6] pb-2">
                        Professional Information
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-[#06202B] mb-1">Position*</label>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white border border-[#A6CDC6] rounded-lg py-2 px-4 text-[#06202B] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#06202B] mb-1">Department*</label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white border border-[#A6CDC6] rounded-lg py-2 px-4 text-[#06202B] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                        >
                          <option value="">Select Department</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                          <option value="Finance">Finance</option>
                          <option value="Operations">Operations</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#06202B] mb-1">Role*</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white border border-[#A6CDC6] rounded-lg py-2 px-4 text-[#06202B] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                        >
                          <option value="">Select Role</option>
                          <option value="Management">Management</option>
                          <option value="Head">Head</option>
                          <option value="Developer">Developer</option>
                          <option value="Analyst">Analyst</option>
                          <option value="Staff">Staff</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#06202B] mb-1">Salary</label>
                        <input
                          type="text"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#A6CDC6] rounded-lg py-2 px-4 text-[#06202B] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#06202B] mb-1">Experience (years)</label>
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#A6CDC6] rounded-lg py-2 px-4 text-[#06202B] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                        />
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-lg font-semibold text-[#077A7D] border-b border-[#A6CDC6] pb-2">
                        Additional Information
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-[#06202B] mb-1">Skills (comma separated)</label>
                        <input
                          type="text"
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#A6CDC6] rounded-lg py-2 px-4 text-[#06202B] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                          placeholder="JavaScript, React, Project Management"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#06202B] mb-1">Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full bg-white border border-[#A6CDC6] rounded-lg py-2 px-4 text-[#06202B] focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-[#077A7D] text-[#077A7D] rounded-lg hover:bg-[#077A7D] hover:text-[#FBF5DD] transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#DDA853] text-[#06202B] font-semibold rounded-lg hover:bg-[#c09548] transition duration-200"
                    >
                      Add Employee
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;