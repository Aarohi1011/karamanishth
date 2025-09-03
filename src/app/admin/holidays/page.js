'use client'
import React, { useState, useEffect } from 'react';
import { format, isAfter } from 'date-fns';
import { auth } from '@/app/lib/auth';
import { useRouter } from 'next/navigation';

const Holidays = () => {
  const [holidays, setHolidays] = useState({
    customHolidays: [],
    weeklyHolidays: [],
    settings: { weeklyHoliday: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    recurring: false,
    recurrencePattern: 'yearly',
    isWeeklyHoliday: false,
    isCustomHoliday: true
  });

  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await auth();
        if (userData === 'No Token') {
          router.push('/login');
        } else {
          setBusinessId(userData.businessId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    getUserData();
  }, [router]);

  // Fetch holidays from API
  useEffect(() => {
    const fetchHolidays = async () => {
      if (!businessId) return;
      
      try {
        const response = await fetch(`/api/business/holiday?businessId=${businessId}`);
        const data = await response.json();
        if (data.success) {
          setHolidays(data.data);
        } else {
          setError(data.msg || 'Failed to fetch holidays');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [businessId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHoliday(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewHoliday(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Submit new holiday
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/business/holiday', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: businessId,
          ...newHoliday,
          date: new Date(newHoliday.date).toISOString()
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh holidays
        const refreshResponse = await fetch(`/api/business/holiday?businessid=${businessId}`);
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setHolidays(refreshData.data);
        }
        
        setIsModalOpen(false);
        setNewHoliday({
          name: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          description: '',
          recurring: false,
          recurrencePattern: 'yearly',
          isWeeklyHoliday: false,
          isCustomHoliday: true
        });
      } else {
        setError(data.msg || 'Failed to add holiday');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Combine and sort holidays by date
  const allHolidays = [
    ...holidays.customHolidays,
    ...holidays.weeklyHolidays
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) return <div className="min-h-screen bg-[#FBF5DD] p-6 flex justify-center items-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-[#FBF5DD] p-6 flex justify-center items-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#FBF5DD] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#06202B]">Holiday Calendar</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#DDA853] hover:bg-[#16404D] text-white font-semibold py-2 px-4 rounded-lg transition duration-300 w-full sm:w-auto text-center"
          >
            + New Holiday
          </button>
        </div>

        {/* Holidays List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Table headers - hidden on mobile, shown on larger screens */}
          <div className="hidden md:grid md:grid-cols-12 bg-[#06202B] text-white p-4 font-semibold">
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-1">Days Remaining</div>
          </div>
          
          {allHolidays.length === 0 ? (
            <div className="p-6 text-center text-[#16404D]">
              No holidays found. Add your first holiday!
            </div>
          ) : (
            allHolidays.map((holiday) => {
              const daysRemaining = Math.ceil((new Date(holiday.date) - new Date()) / (1000 * 60 * 60 * 24));
              const isUpcoming = isAfter(new Date(holiday.date), new Date());
              const holidayType = holiday.isWeeklyHoliday ? 'Weekly' : 
                                holiday.isCustomHoliday ? 'Custom' : 'Recurring';
              
              return (
                <div key={holiday._id || holiday.date}>
                  {/* Desktop view */}
                  <div className="hidden md:grid md:grid-cols-12 p-4 border-b border-[#A6CDC6] hover:bg-[#F5EEDD] transition duration-200">
                    <div className="col-span-3 font-medium text-[#06202B]">{holiday.name}</div>
                    <div className="col-span-2 text-[#077A7D]">
                      {format(new Date(holiday.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="col-span-4 text-[#16404D] truncate">{holiday.description}</div>
                    <div className="col-span-2">
                      <span className="bg-[#E2F0FD] text-[#06202B] py-1 px-3 rounded-full text-sm">
                        {holidayType}
                      </span>
                    </div>
                    <div className="col-span-1">
                      {isUpcoming ? (
                        <span className="bg-[#7AE2CF] text-[#06202B] py-1 px-3 rounded-full text-sm">
                          {daysRemaining} days
                        </span>
                      ) : (
                        <span className="bg-[#F5EEDD] text-[#06202B] py-1 px-3 rounded-full text-sm">
                          Passed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Mobile view */}
                  <div className="md:hidden p-4 border-b border-[#A6CDC6] hover:bg-[#F5EEDD] transition duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-[#06202B] text-lg">{holiday.name}</div>
                      <div className="flex-shrink-0">
                        <span className="bg-[#E2F0FD] text-[#06202B] py-1 px-2 rounded-full text-xs">
                          {holidayType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-[#077A7D] mb-2">
                      {format(new Date(holiday.date), 'MMM dd, yyyy')}
                    </div>
                    
                    <div className="text-[#16404D] mb-3 text-sm line-clamp-2">
                      {holiday.description}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      {isUpcoming ? (
                        <span className="bg-[#7AE2CF] text-[#06202B] py-1 px-3 rounded-full text-xs">
                          {daysRemaining} days remaining
                        </span>
                      ) : (
                        <span className="bg-[#F5EEDD] text-[#06202B] py-1 px-3 rounded-full text-xs">
                          Passed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Holiday Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="bg-[#06202B] text-white p-4 rounded-t-xl flex justify-between items-center sticky top-0">
                <h2 className="text-xl font-semibold">Add New Holiday</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:text-[#7AE2CF] text-xl"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 md:p-6">
                <div className="mb-4">
                  <label className="block text-[#16404D] font-medium mb-2">Holiday Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newHoliday.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#A6CDC6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#077A7D]"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-[#16404D] font-medium mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={newHoliday.date}
                    onChange={handleInputChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full p-3 border border-[#A6CDC6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#077A7D]"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-[#16404D] font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newHoliday.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-[#A6CDC6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#077A7D]"
                  ></textarea>
                </div>
                
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    name="recurring"
                    checked={newHoliday.recurring}
                    onChange={handleCheckboxChange}
                    className="mr-2 h-5 w-5"
                  />
                  <label className="text-[#16404D]">Recurring Holiday</label>
                </div>
                
                {newHoliday.recurring && (
                  <div className="mb-4">
                    <label className="block text-[#16404D] font-medium mb-2">Recurrence Pattern</label>
                    <select
                      name="recurrencePattern"
                      value={newHoliday.recurrencePattern}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#A6CDC6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#077A7D]"
                    >
                      <option value="yearly">Yearly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
                
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-3 sm:py-2 border border-[#06202B] text-[#06202B] rounded-lg hover:bg-[#F5EEDD] transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-3 sm:py-2 bg-[#077A7D] text-white rounded-lg hover:bg-[#16404D] transition duration-300"
                  >
                    Save Holiday
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Holidays;