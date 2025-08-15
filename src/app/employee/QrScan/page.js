'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiClock, FiCalendar, FiCheck, FiX, FiRefreshCw, FiLogIn, FiLogOut, FiMapPin } from 'react-icons/fi';
import { auth } from '@/app/lib/auth';

const EmployeeAttendancePage = () => {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(() => {
        const options = { timeZone: "Asia/Kolkata" };
        const formatter = new Intl.DateTimeFormat("en-CA", options); // YYYY-MM-DD format
        return formatter.format(new Date());
    });

    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [toast, setToast] = useState(null);
    const [attendanceType, setAttendanceType] = useState('in');
    const [employeeAttendance, setEmployeeAttendance] = useState(null);
    const [businessSettings, setBusinessSettings] = useState(null);
    const [locationStatus, setLocationStatus] = useState(null);
    const [isCheckingLocation, setIsCheckingLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [holidayInfo, setHolidayInfo] = useState(null);

    // Calculate distance between two coordinates in meters
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    // Check if current location is within business radius
    const checkLocation = useCallback(async (position) => {
        if (!businessSettings) return false;

        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });

        const distance = calculateDistance(
            latitude,
            longitude,
            businessSettings.coordinates.latitude,
            businessSettings.coordinates.longitude
        );

        return distance <= businessSettings.radiusMeters;
    }, [businessSettings]);

    // Fetch business settings
    const fetchBusinessSettings = async (businessId) => {
        try {
            const response = await fetch(`/api/business/settings/?businessId=${businessId}`);
            const data = await response.json();

            if (data.success) {
                setBusinessSettings(data.data);
                return data.data;
            } else {
                throw new Error(data.msg || 'Failed to load business settings');
            }
        } catch (error) {
            console.error('Error fetching business settings:', error);
            showToast('Failed to load business settings', 'error');
            return null;
        }
    };

    // Fetch employee attendance
    const fetchEmployeeAttendance = useCallback(async () => {
        try {
            setLoading(true);
            const userData = await auth();
            const id = userData._id;
            const businessId = userData.businessId;

            // Fetch business settings if not already loaded
            if (!businessSettings) {
                await fetchBusinessSettings(businessId);
            }

            const response = await fetch(`/api/employee/attendance?employeeId=${id}&businessId=${businessId}`);

            if (response.ok) {
                const data = await response.json();
                if (data.data) {
                    // Format the time for display
                    const formatTime = (dateString) => {
                        if (!dateString) return null;
                        return new Date(dateString).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Kolkata"
                        });
                    };

                    // Set attendance status with new fields
                    setAttendanceStatus({
                        inTime: formatTime(data.data.inTime),
                        outTime: formatTime(data.data.outTime),
                        inStatus: data.data.inStatus,
                        outStatus: data.data.outStatus,
                        workHours: data.data.workHours,
                        employee: data.data.employee
                    });

                    // Determine which button to show
                    if (data.data.inTime && !data.data.outTime) {
                        setAttendanceType('out');
                    } else if (data.data.inTime && data.data.outTime) {
                        setAttendanceType(null);
                    } else {
                        setAttendanceType('in');
                    }
                } else {
                    setAttendanceStatus(null);
                    setAttendanceType('in');
                }
            } else {
                throw new Error('Failed to fetch attendance data');
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
            showToast('Failed to fetch attendance data', 'error');
            setAttendanceStatus(null);
            setAttendanceType('in');
        } finally {
            setLoading(false);
        }
    }, [businessSettings]);

    useEffect(() => {
        fetchEmployeeAttendance();
    }, [fetchEmployeeAttendance]);

    // Get device info
    const getDeviceInfo = () => {
        const userAgent = navigator.userAgent;
        let deviceInfo = "Unknown Device";

        if (/iPhone/.test(userAgent)) {
            deviceInfo = "iPhone";
            if (/iPhone\s+(\d+)/.test(userAgent)) {
                deviceInfo = `iPhone ${userAgent.match(/iPhone\s+(\d+)/)[1]}`;
            }
        } else if (/iPad/.test(userAgent)) {
            deviceInfo = "iPad";
        } else if (/Android/.test(userAgent)) {
            deviceInfo = "Android Device";
            if (/Android\s+([^;]+)/.test(userAgent)) {
                deviceInfo = userAgent.match(/Android\s+([^;]+)/)[1];
            }
        } else if (/Windows/.test(userAgent)) {
            deviceInfo = "Windows PC";
        } else if (/Macintosh/.test(userAgent)) {
            deviceInfo = "Mac";
        }

        return deviceInfo;
    };

    // Mark attendance
    const markAttendance = useCallback(async () => {
        if (!businessSettings) {
            showToast('Business settings not loaded', 'error');
            return;
        }

        setIsCheckingLocation(true);
        setLocationStatus('Checking your location...');

        try {
            // Get current position
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            // Check if location is within radius
            const isWithinRadius = await checkLocation(position);

            if (!isWithinRadius) {
                setLocationStatus('You are not within the business premises');
                showToast('You must be within the business premises to mark attendance', 'error');
                return;
            }

            setLoading(true);
            setLocationStatus('Location verified. Marking attendance...');

            const deviceInfo = getDeviceInfo();
            const userData = await auth();
            const businessId = userData.businessId;

            // Prepare request data
            const requestData = {
                businessId: userData.businessId,
                deviceInfo
            };

            // Add inTime or outTime based on attendanceType
            if (attendanceType === 'in') {
                requestData.inTime = new Date().toISOString();
            } else {
                requestData.outTime = new Date().toISOString();
            }

            // Send request to API
            const response = await fetch('/api/employee/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.msg && data.msg.includes('holiday')) {
                    setHolidayInfo(data.msg);
                    showToast(data.msg, 'error');
                } else {
                    showToast(`Attendance ${attendanceType === 'in' ? 'in' : 'out'} time marked successfully!`, 'success');
                    await fetchEmployeeAttendance();
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to mark attendance');
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            showToast(error.message || 'Failed to mark attendance', 'error');
        } finally {
            setLoading(false);
            setIsCheckingLocation(false);
            setLocationStatus(null);
        }
    }, [attendanceType, businessSettings, checkLocation, fetchEmployeeAttendance]);

    // Show toast notification
    const showToast = (message, type) => {
        const newToast = {
            id: Date.now(),
            message,
            type
        };
        setToast(newToast);

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'On Time':
                return 'bg-green-100 text-green-800';
            case 'Late':
                return 'bg-yellow-100 text-yellow-800';
            case 'Early Leave':
                return 'bg-orange-100 text-orange-800';
            case 'Absent':
                return 'bg-red-100 text-red-800';
            case 'Half-Day':
                return 'bg-blue-100 text-blue-800';
            case 'Leave':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#06202B] to-[#16404D] p-4 md:p-8">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-[#F5EEDD] font-medium flex items-center ${toast.type === 'success' ? 'bg-[#077A7D]' : 'bg-[#DDA853]'
                            }`}
                    >
                        {toast.type === 'success' ? (
                            <FiCheck className="w-5 h-5 mr-2" />
                        ) : (
                            <FiX className="w-5 h-5 mr-2" />
                        )}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto bg-[#FBF5DD] rounded-2xl shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#077A7D] to-[#16404D] p-6 text-[#F5EEDD] text-center">
                    <h1 className="text-2xl font-bold">Employee Attendance</h1>
                    <p className="text-[#A6CDC6] mt-1">Mark your attendance using location</p>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    {/* Date Display */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-[#F5EEDD] rounded-lg px-4 py-2 flex items-center border border-[#A6CDC6]">
                            <FiCalendar className="mr-2 text-[#077A7D]" />
                            <span className="text-[#16404D] font-medium">{new Date(date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>

                    {/* Holiday Notice */}
                    {holidayInfo && (
                        <div className="mb-4 p-3 bg-purple-100 text-purple-800 rounded-lg text-center">
                            <p className="font-medium">{holidayInfo}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && !attendanceStatus && (
                        <div className="flex justify-center items-center py-8">
                            <FiRefreshCw className="animate-spin text-[#077A7D] w-8 h-8" />
                        </div>
                    )}

                    {/* Attendance Status Card */}
                    {attendanceStatus ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`border rounded-xl p-6 mb-6 text-center ${attendanceStatus.outTime
                                ? 'bg-[#7AE2CF]/20 border-[#7AE2CF]'
                                : 'bg-[#F5EEDD] border-[#A6CDC6]'
                                }`}
                        >
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                {attendanceStatus.outTime ? (
                                    <FiCheck className="w-8 h-8 text-[#077A7D]" />
                                ) : (
                                    <FiClock className="w-8 h-8 text-[#077A7D] animate-pulse" />
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-[#16404D] mb-1">
                                {attendanceStatus.outTime ? 'Attendance Completed' : 'Attendance In Progress'}
                            </h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-center">
                                    <FiLogIn className="mr-2 text-[#077A7D]" />
                                    <span className="text-[#16404D]">
                                        In Time: {attendanceStatus.inTime || '--:--'}
                                    </span>
                                    {attendanceStatus.inStatus && (
                                        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusColor(attendanceStatus.inStatus)}`}>
                                            {attendanceStatus.inStatus}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-center">
                                    <FiLogOut className="mr-2 text-[#077A7D]" />
                                    <span className="text-[#16404D]">
                                        Out Time: {attendanceStatus.outTime || '--:--'}
                                    </span>
                                    {attendanceStatus.outStatus && (
                                        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusColor(attendanceStatus.outStatus)}`}>
                                            {attendanceStatus.outStatus}
                                        </span>
                                    )}
                                </div>
                                {attendanceStatus.workHours > 0 && (
                                    <div className="flex items-center justify-center">
                                        <FiClock className="mr-2 text-[#077A7D]" />
                                        <span className="text-[#16404D]">
                                            Work Hours: {attendanceStatus.workHours} hrs
                                        </span>
                                    </div>
                                )}
                            </div>

                            {!attendanceStatus.outTime && attendanceType === 'out' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={markAttendance}
                                    disabled={loading || isCheckingLocation}
                                    className="mt-4 px-6 py-2 bg-gradient-to-r from-[#077A7D] to-[#16404D] text-[#F5EEDD] font-medium rounded-lg shadow-md flex items-center mx-auto disabled:opacity-50"
                                >
                                    {isCheckingLocation ? (
                                        <span className="flex items-center">
                                            <FiRefreshCw className="animate-spin mr-2" />
                                            Verifying Location...
                                        </span>
                                    ) : (
                                        'Mark Out Time'
                                    )}
                                </motion.button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[#F5EEDD] border border-[#A6CDC6] rounded-xl p-6 mb-6 text-center"
                        >
                            <div className="w-16 h-16 bg-[#7AE2CF]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiUser className="w-8 h-8 text-[#077A7D]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#16404D] mb-2">Mark Your Attendance</h3>
                            <p className="text-[#077A7D] mb-4">Use your location to register your attendance</p>

                            {attendanceType === 'in' && !holidayInfo && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={markAttendance}
                                    disabled={loading || isCheckingLocation}
                                    className="px-6 py-3 bg-gradient-to-r from-[#077A7D] to-[#16404D] text-[#F5EEDD] font-medium rounded-lg shadow-md flex items-center mx-auto disabled:opacity-50"
                                >
                                    {isCheckingLocation ? (
                                        <span className="flex items-center">
                                            <FiRefreshCw className="animate-spin mr-2" />
                                            Verifying Location...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <FiMapPin className="mr-2" />
                                            Mark In Time
                                        </span>
                                    )}
                                </motion.button>
                            )}
                        </motion.div>
                    )}

                    {/* Location Status */}
                    {locationStatus && (
                        <div className="mt-4 p-3 bg-[#F5EEDD] border border-[#A6CDC6] rounded-lg text-center">
                            <p className="text-[#16404D] flex items-center justify-center">
                                <FiMapPin className="mr-2 text-[#077A7D]" />
                                {locationStatus}
                            </p>
                        </div>
                    )}

                    {/* Current Location Display */}
                    {currentLocation && (
                        <div className="mt-4 p-3 bg-[#F5EEDD] border border-[#A6CDC6] rounded-lg">
                            <p className="text-sm text-[#16404D]">
                                <span className="font-medium">Your Location:</span>
                                <br />
                                Lat: {currentLocation.latitude.toFixed(6)}
                                <br />
                                Lng: {currentLocation.longitude.toFixed(6)}
                            </p>
                            {businessSettings?.coordinates && (
                                <p className="text-sm text-[#16404D] mt-2">
                                    <span className="font-medium">Business Location:</span>
                                    <br />
                                    Lat: {businessSettings.coordinates.latitude.toFixed(6)}
                                    <br />
                                    Lng: {businessSettings.coordinates.longitude.toFixed(6)}
                                    <br />
                                    Radius: {businessSettings.radiusMeters} meters
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default EmployeeAttendancePage;