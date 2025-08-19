// app/employees/[id]/page.js
'use client'

import { useEffect, useState ,use} from 'react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiEdit, FiSave, FiTrash2, FiUser, FiPhone, FiMail, FiMapPin, FiBriefcase, FiDollarSign, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const colorPalette = {
  primaryDark: '#06202B',
  primary: '#077A7D',
  primaryLight: '#7AE2CF',
  background: '#F5EEDD',
  accent: '#DDA853',
  secondaryDark: '#16404D',
  secondaryLight: '#A6CDC6',
  lightBackground: '#FBF5DD'
}

export default function EmployeeDetailPage({ params }) {
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({})
  const router = useRouter()
  //  const id = params.id
   const { id } = use(params)

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`/api/business/employee?id=${id}`)
        const data = await response.json()
        if (data.success) {
          setEmployee(data.data)
          setFormData(data.data)
        } else {
          toast.error('Failed to fetch employee data')
          router.push('/employees')
        }
      } catch (error) {
        console.error('Error fetching employee:', error)
        toast.error('Error fetching employee data')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/business/employee', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setEmployee(data.data)
        setEditMode(false)
        toast.success('Employee updated successfully')
      } else {
        toast.error(data.msg || 'Failed to update employee')
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      toast.error('Error updating employee')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`/api/business/employee?id=${params.id}`, {
          method: 'DELETE'
        })

        const data = await response.json()
        if (data.success) {
          toast.success('Employee deleted successfully')
          router.push('/employees')
        } else {
          toast.error(data.msg || 'Failed to delete employee')
        }
      } catch (error) {
        console.error('Error deleting employee:', error)
        toast.error('Error deleting employee')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colorPalette.lightBackground }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto" style={{ borderColor: colorPalette.primary }}></div>
          <p className="mt-4" style={{ color: colorPalette.primaryDark }}>Loading employee data...</p>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colorPalette.lightBackground }}>
        <div className="text-center">
          <p className="text-xl" style={{ color: colorPalette.primaryDark }}>Employee not found</p>
          <button
            onClick={() => router.push('/employees')}
            className="mt-4 px-4 py-2 rounded-md"
            style={{ backgroundColor: colorPalette.primary, color: 'white' }}
          >
            Back to Employees
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colorPalette.lightBackground }}>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/admin/employee_management')}
          className="flex items-center mb-6"
          style={{ color: colorPalette.primary }}
        >
          <FiArrowLeft className="mr-2" /> Back to Employees
        </button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colorPalette.primaryDark }}>
            {editMode ? 'Edit Employee' : 'Employee Details'}
          </h1>
          <div className="flex space-x-4">
            {editMode ? (
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 rounded-md"
                style={{ backgroundColor: colorPalette.primary, color: 'white' }}
              >
                <FiSave className="mr-2" /> Save
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center px-4 py-2 rounded-md"
                style={{ backgroundColor: colorPalette.accent, color: colorPalette.primaryDark }}
              >
                <FiEdit className="mr-2" /> Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 rounded-md"
              style={{ backgroundColor: colorPalette.secondaryDark, color: 'white' }}
            >
              <FiTrash2 className="mr-2" /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: colorPalette.background }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colorPalette.secondaryDark }}>
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <FiUser className="mr-3" style={{ color: colorPalette.primary }} />
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                    style={{ borderColor: colorPalette.secondaryLight }}
                  />
                ) : (
                  <p style={{ color: colorPalette.primaryDark }}>{employee.name}</p>
                )}
              </div>

              <div className="flex items-center">
                <FiMail className="mr-3" style={{ color: colorPalette.primary }} />
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                    style={{ borderColor: colorPalette.secondaryLight }}
                  />
                ) : (
                  <p style={{ color: colorPalette.primaryDark }}>{employee.email || 'N/A'}</p>
                )}
              </div>

              <div className="flex items-center">
                <FiPhone className="mr-3" style={{ color: colorPalette.primary }} />
                {editMode ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                    style={{ borderColor: colorPalette.secondaryLight }}
                  />
                ) : (
                  <p style={{ color: colorPalette.primaryDark }}>{employee.phone}</p>
                )}
              </div>

              <div className="flex items-center">
                <FiMapPin className="mr-3" style={{ color: colorPalette.primary }} />
                {editMode ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                    style={{ borderColor: colorPalette.secondaryLight }}
                  />
                ) : (
                  <p style={{ color: colorPalette.primaryDark }}>{employee.address || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: colorPalette.background }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colorPalette.secondaryDark }}>
              Professional Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <FiBriefcase className="mr-3" style={{ color: colorPalette.primary }} />
                {editMode ? (
                  <select
                    name="role"
                    value={formData.role || ''}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                    style={{ borderColor: colorPalette.secondaryLight }}
                  >
                    <option value="Owner">Owner</option>
                    <option value="Manager">Manager</option>
                    <option value="Head">Head</option>
                    <option value="Staff">Staff</option>
                  </select>
                ) : (
                  <p style={{ color: colorPalette.primaryDark }}>{employee.role}</p>
                )}
              </div>

              <div className="flex items-center">
                <FiDollarSign className="mr-3" style={{ color: colorPalette.primary }} />
                {editMode ? (
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary || ''}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                    style={{ borderColor: colorPalette.secondaryLight }}
                  />
                ) : (
                  <p style={{ color: colorPalette.primaryDark }}>{employee.salary || 'N/A'}</p>
                )}
              </div>

              <div className="flex items-center">
                <FiCalendar className="mr-3" style={{ color: colorPalette.primary }} />
                <p style={{ color: colorPalette.primaryDark }}>
                  Joined: {new Date(employee.joinDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center">
                {employee.active ? (
                  <FiCheckCircle className="mr-3" style={{ color: '#10B981' }} />
                ) : (
                  <FiXCircle className="mr-3" style={{ color: '#EF4444' }} />
                )}
                {editMode ? (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active || false}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Active Employee
                  </label>
                ) : (
                  <p style={{ color: colorPalette.primaryDark }}>
                    Status: {employee.active ? 'Active' : 'Inactive'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: colorPalette.background }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: colorPalette.secondaryDark }}>
            Additional Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2" style={{ color: colorPalette.primary }}>Business Name</h3>
              {editMode ? (
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: colorPalette.secondaryLight }}
                />
              ) : (
                <p style={{ color: colorPalette.primaryDark }}>{employee.businessName || 'N/A'}</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2" style={{ color: colorPalette.primary }}>Experience</h3>
              {editMode ? (
                <input
                  type="text"
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: colorPalette.secondaryLight }}
                />
              ) : (
                <p style={{ color: colorPalette.primaryDark }}>{employee.experience || 'N/A'}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <h3 className="font-medium mb-2" style={{ color: colorPalette.primary }}>Bio</h3>
              {editMode ? (
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: colorPalette.secondaryLight }}
                />
              ) : (
                <p style={{ color: colorPalette.primaryDark }}>{employee.bio || 'No bio available'}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <h3 className="font-medium mb-2" style={{ color: colorPalette.primary }}>Skills</h3>
              {editMode ? (
                <input
                  type="text"
                  name="skills"
                  value={formData.skills ? formData.skills.join(', ') : ''}
                  onChange={(e) => {
                    const skillsArray = e.target.value.split(',').map(skill => skill.trim())
                    setFormData(prev => ({ ...prev, skills: skillsArray }))
                  }}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: colorPalette.secondaryLight }}
                  placeholder="Enter skills separated by commas"
                />
              ) : employee.skills && employee.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: colorPalette.secondaryLight, color: colorPalette.secondaryDark }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: colorPalette.primaryDark }}>No skills listed</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}