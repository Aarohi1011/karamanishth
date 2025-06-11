'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { auth } from '@/app/lib/auth';

const dayMap = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
};

export default function SettingsPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    defaultInTime: '09:00',
    defaultOutTime: '18:00',
    gracePeriodMinutes: 15,
    lunchStartTime: '13:00',
    lunchDurationMinutes: 60,
    workingDays: [1, 2, 3, 4, 5], // Default to Mon-Fri
    weeklyHoliday: [0, 6] // Default to Sun, Sat
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await auth();
        if (userData === 'No Token') {
          router.push('/login');
        } else {
          setBusinessId(userData.businessId);
          setFormData(prev => ({
            ...prev,
            businessId: userData._id
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (!businessId) return;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/business/settings/?businessId=${businessId}`);
        const data = await response.json();
        console.log("Fetched settings data:", data);

        if (data.success) {
          setSettings(data.data);
          setFormData(prev => ({
            ...prev,
            ...data.data,
            workingDays: Array.isArray(data.data.workingDays) ? data.data.workingDays : [],
            weeklyHoliday: Array.isArray(data.data.weeklyHoliday) ? data.data.weeklyHoliday : []
          }));
        } else {
          setError(data.msg || 'Failed to load settings');
        }
      } catch (err) {
        setError('An error occurred while fetching settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [businessId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Minutes') ? parseInt(value) || 0 : value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const workingDays = prev.workingDays ? [...prev.workingDays] : [];
      const weeklyHoliday = prev.weeklyHoliday ? [...prev.weeklyHoliday] : [];

      if (workingDays.includes(day)) {
        return {
          ...prev,
          workingDays: workingDays.filter(d => d !== day),
          weeklyHoliday: [...weeklyHoliday, day]
        };
      } else {
        return {
          ...prev,
          workingDays: [...workingDays, day],
          weeklyHoliday: weeklyHoliday.filter(d => d !== day)
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = {
        businessId: businessId,
        settingsData: {
          defaultInTime: formData.defaultInTime,
          defaultOutTime: formData.defaultOutTime,
          gracePeriodMinutes: formData.gracePeriodMinutes,
          lunchStartTime: formData.lunchStartTime,
          lunchDurationMinutes: formData.lunchDurationMinutes,
          workingDays: formData.workingDays || [],
          weeklyHoliday: formData.weeklyHoliday || []
        }
      };
      console.log(payload);
      
      const response = await fetch(`/api/business/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);

      
      if (data.success) {
        setSettings(data.data);
        setFormData(prev => ({
          ...prev,
          ...data.data,
          workingDays: data.data.workingDays || [],
          weeklyHoliday: data.data.weeklyHoliday || []
        }));
        setIsEditing(false);
      } else {
        setError(data.msg || 'Failed to update settings');
      }
    } catch (err) {
      setError('An error occurred while updating settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF5DD] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#077A7D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FBF5DD] flex items-center justify-center">
        <div className="bg-[#F5EEDD] p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#06202B] mb-4">Error</h2>
          <p className="text-[#16404D]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#DDA853] hover:bg-[#c09547] text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF5DD]">
      <Head>
        <title>Business Settings</title>
        <meta name="description" content="Manage your business settings" />
      </Head>

      <header className="bg-[#06202B] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {settings?.business?.businessName || 'Business'} Settings
          </h1>
          <span className="bg-[#077A7D] px-3 py-1 rounded-full text-sm">
            {settings?.business?.businessType || 'Business'}
          </span>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <div className="bg-[#F5EEDD] rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-[#A6CDC6] border-b border-[#7AE2CF]">
            <h2 className="text-xl font-semibold text-[#16404D]">
              Business Hours Configuration
            </h2>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#16404D] mb-1">
                    Default In Time
                  </label>
                  <input
                    type="time"
                    name="defaultInTime"
                    value={formData.defaultInTime || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#7AE2CF] rounded focus:ring-2 focus:ring-[#077A7D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#16404D] mb-1">
                    Default Out Time
                  </label>
                  <input
                    type="time"
                    name="defaultOutTime"
                    value={formData.defaultOutTime || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#7AE2CF] rounded focus:ring-2 focus:ring-[#077A7D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#16404D] mb-1">
                    Grace Period (minutes)
                  </label>
                  <input
                    type="number"
                    name="gracePeriodMinutes"
                    value={formData.gracePeriodMinutes || 0}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#7AE2CF] rounded focus:ring-2 focus:ring-[#077A7D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#16404D] mb-1">
                    Lunch Start Time
                  </label>
                  <input
                    type="time"
                    name="lunchStartTime"
                    value={formData.lunchStartTime || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#7AE2CF] rounded focus:ring-2 focus:ring-[#077A7D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#16404D] mb-1">
                    Lunch Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="lunchDurationMinutes"
                    value={formData.lunchDurationMinutes || 0}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#7AE2CF] rounded focus:ring-2 focus:ring-[#077A7D] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#16404D] mb-3">Working Days</h3>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {Object.entries(dayMap).map(([dayNum, dayName]) => {
                    const day = parseInt(dayNum);
                    const isWorkingDay = formData.workingDays?.includes(day);
                    return (
                      <div 
                        key={day} 
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => handleDayToggle(day)}
                      >
                        <span className="text-xs text-[#16404D] mb-1">{dayName.slice(0, 3)}</span>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isWorkingDay ? 'bg-[#7AE2CF]' : 'bg-[#F5EEDD] border border-[#A6CDC6]'
                          }`}
                        >
                          {day}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-[#7AE2CF] text-[#16404D] rounded hover:bg-[#F5EEDD] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#DDA853] text-white rounded hover:bg-[#c09547] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-[#16404D]">Default In Time</h3>
                  <p className="mt-1 text-lg font-semibold text-[#06202B]">
                    {settings?.defaultInTime || '09:00'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#16404D]">Default Out Time</h3>
                  <p className="mt-1 text-lg font-semibold text-[#06202B]">
                    {settings?.defaultOutTime || '18:00'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#16404D]">Grace Period</h3>
                  <p className="mt-1 text-lg font-semibold text-[#06202B]">
                    {settings?.gracePeriodMinutes || 15} minutes
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#16404D]">Lunch Start Time</h3>
                  <p className="mt-1 text-lg font-semibold text-[#06202B]">
                    {settings?.lunchStartTime || '13:00'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#16404D]">Lunch Duration</h3>
                  <p className="mt-1 text-lg font-semibold text-[#06202B]">
                    {settings?.lunchDurationMinutes || 60} minutes
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#16404D] mb-3">Working Days</h3>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {Object.entries(dayMap).map(([dayNum, dayName]) => {
                    const day = parseInt(dayNum);
                    const isWorkingDay = settings?.workingDays?.includes(day);
                    return (
                      <div key={day} className="flex flex-col items-center">
                        <span className="text-xs text-[#16404D] mb-1">{dayName.slice(0, 3)}</span>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isWorkingDay ? 'bg-[#7AE2CF]' : 'bg-[#F5EEDD] border border-[#A6CDC6]'
                          }`}
                        >
                          {day}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#DDA853] text-white rounded hover:bg-[#c09547] transition-colors"
                >
                  Edit Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {settings?.createdAt && (
          <div className="mt-6 text-sm text-[#16404D] text-right">
            <p>Last updated: {new Date(settings.updatedAt || settings.createdAt).toLocaleString()}</p>
          </div>
        )}
      </main>
    </div>
  );
}