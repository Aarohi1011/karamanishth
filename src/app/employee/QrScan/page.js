'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiClock, FiCalendar, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import QrScanner from 'qr-scanner';

const TeacherAttendancePage = () => {
    const [scanResult, setScanResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isResultReady, setIsResultReady] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [facingMode, setFacingMode] = useState('environment');
    const [toast, setToast] = useState(null);
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    const handleScan = (result) => {
        if (result) {
            setScanResult(result.data);
            setIsResultReady(true);
            stopScanner();
        }
    };

    const handleError = (err) => {
        console.error('Error scanning QR code:', err);
    };

    const startScanner = () => {
        if (videoRef.current && !qrScannerRef.current) {
            qrScannerRef.current = new QrScanner(
                videoRef.current,
                handleScan,
                {
                    preferredCamera: facingMode,
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                    onDecodeError: handleError,
                }
            );
            qrScannerRef.current.start();
        }
    };

    const stopScanner = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
            qrScannerRef.current.destroy();
            qrScannerRef.current = null;
        }
    };

    useEffect(() => {
        if (isScanning) {
            startScanner();
        } else {
            stopScanner();
        }

        return () => {
            stopScanner();
        };
    }, [isScanning, facingMode]);

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

    const sendTokenToApi = useCallback(async (token) => {
        setLoading(true);
        try {
            const response = await fetch('/api/attendance/TeacherAttendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    date,
                    trackingstatus: 'Arrival'
                }),
            });

            if (response.ok) {
                const data = await response.json();
                showToast('Attendance marked successfully!', 'success');
                setAttendanceStatus({
                    time: new Date().toLocaleTimeString(),
                    status: 'Present'
                });
                setIsResultReady(false);
            } else {
                const errorData = await response.json();
                showToast(errorData.msg || 'Failed to verify token.', 'error');
            }
        } catch (error) {
            console.error('Error sending token:', error);
            showToast('An error occurred while submitting the token.', 'error');
        } finally {
            setLoading(false);
        }
    }, [date]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium flex items-center ${
                            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
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
                className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">Teacher Attendance</h1>
                    <p className="text-white/90 mt-1">Mark your daily attendance</p>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    {/* Date Display */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-50 rounded-lg px-4 py-2 flex items-center">
                            <FiCalendar className="mr-2 text-blue-600" />
                            <span className="text-blue-800 font-medium">{new Date(date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>

                    {/* Attendance Status Card */}
                    {attendanceStatus ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiCheck className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-green-800 mb-1">Attendance Recorded</h3>
                            <p className="text-green-600 mb-2">You marked your attendance at {attendanceStatus.time}</p>
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                {attendanceStatus.status}
                            </span>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-center"
                        >
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiUser className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Mark Your Attendance</h3>
                            <p className="text-blue-600 mb-4">Scan your QR code to register your arrival time</p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsScanning(true)}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md flex items-center mx-auto"
                            >
                                Scan QR Code
                            </motion.button>
                        </motion.div>
                    )}

                    {/* QR Scanner Modal */}
                    <AnimatePresence>
                        {isScanning && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black z-50 flex flex-col"
                            >
                                {/* Scanner Header */}
                                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                                    <h3 className="text-xl font-semibold">Scan QR Code</h3>
                                    <button
                                        onClick={() => setIsScanning(false)}
                                        className="text-white hover:text-blue-200 p-2"
                                    >
                                        <FiX className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Scanner Content */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex-1 relative">
                                        <video
                                            ref={videoRef}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Scanner Frame Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="border-4 border-white/50 rounded-xl w-64 h-64 relative">
                                                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                                                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                                                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                                                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleCamera}
                                            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white/90 text-blue-700 px-4 py-2 rounded-lg shadow-lg font-medium hover:bg-white flex items-center"
                                        >
                                            <FiRefreshCw className="mr-2" />
                                            Switch Camera ({facingMode === 'environment' ? 'Front' : 'Back'})
                                        </button>
                                    </div>

                                    <div className="bg-black/80 text-white p-4 text-center">
                                        <p className="text-lg">Position your QR code within the frame</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Confirmation Modal */}
                    <AnimatePresence>
                        {isResultReady && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                            >
                                <motion.div
                                    className="bg-white rounded-xl shadow-xl w-full max-w-sm"
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                >
                                    <div className="p-6 text-center">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                                            <FiUser className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Confirm Attendance
                                        </h3>
                                        <p className="text-gray-500 mb-6">
                                            Are you sure you want to mark your attendance now?
                                        </p>
                                        <div className="flex justify-center space-x-4">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setIsResultReady(false)}
                                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Cancel
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => sendTokenToApi(scanResult)}
                                                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </span>
                                                ) : (
                                                    'Confirm Attendance'
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default TeacherAttendancePage;