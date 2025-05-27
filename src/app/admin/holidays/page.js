'use client'
import React, { useState } from 'react';
import { format, addDays, isAfter } from 'date-fns';

const Holidays = () => {
  // Sample holiday data
  const [holidays, setHolidays] = useState([
    {
      id: 1,
      name: 'New Year',
      date: new Date(2024, 0, 1),
      description: 'Celebration of the new year'
    },
    {
      id: 2,
      name: 'Spring Festival',
      date: new Date(2024, 1, 10),
      description: 'Traditional spring festival holiday'
    },
    {
      id: 3,
      name: 'National Day',
      date: new Date(2024, 9, 1),
      description: 'Celebration of national independence'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHoliday(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new holiday
  const handleSubmit = (e) => {
    e.preventDefault();
    const holidayToAdd = {
      id: holidays.length + 1,
      name: newHoliday.name,
      date: new Date(newHoliday.date),
      description: newHoliday.description
    };
    
    setHolidays([...holidays, holidayToAdd]);
    setIsModalOpen(false);
    setNewHoliday({
      name: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      description: ''
    });
  };

  // Sort holidays by date
  const sortedHolidays = [...holidays].sort((a, b) => a.date - b.date);

  return (
    <div className="min-h-screen bg-[#FBF5DD] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#06202B]">Holiday Calendar</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#DDA853] hover:bg-[#16404D] text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            + New Holiday
          </button>
        </div>

        {/* Holidays List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-12 bg-[#06202B] text-white p-4 font-semibold">
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Days Remaining</div>
          </div>
          
          {sortedHolidays.map((holiday) => {
            const daysRemaining = Math.ceil((holiday.date - new Date()) / (1000 * 60 * 60 * 24));
            const isUpcoming = isAfter(holiday.date, new Date());
            
            return (
              <div 
                key={holiday.id} 
                className="grid grid-cols-12 p-4 border-b border-[#A6CDC6] hover:bg-[#F5EEDD] transition duration-200"
              >
                <div className="col-span-3 font-medium text-[#06202B]">{holiday.name}</div>
                <div className="col-span-2 text-[#077A7D]">
                  {format(holiday.date, 'MMM dd, yyyy')}
                </div>
                <div className="col-span-5 text-[#16404D]">{holiday.description}</div>
                <div className="col-span-2">
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
            );
          })}
        </div>

        {/* Add Holiday Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="bg-[#06202B] text-white p-4 rounded-t-xl flex justify-between items-center">
                <h2 className="text-xl font-semibold">Add New Holiday</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:text-[#7AE2CF]"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
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
                
                <div className="mb-6">
                  <label className="block text-[#16404D] font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newHoliday.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-[#A6CDC6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#077A7D]"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-[#06202B] text-[#06202B] rounded-lg hover:bg-[#F5EEDD] transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#077A7D] text-white rounded-lg hover:bg-[#16404D] transition duration-300"
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