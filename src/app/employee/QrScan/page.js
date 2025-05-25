'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiClock, FiCalendar, FiCheck, FiX, FiRefreshCw, FiVideo, FiVideoOff } from 'react-icons/fi';
import QrScanner from 'qr-scanner';

const EmployeeAttendancePage = () => {
    const [scanResult, setScanResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isResultReady, setIsResultReady] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [toast, setToast] = useState(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);

    const handleScan = useCallback((result) => {
        if (result) {
            setScanResult(result.data);
            setIsResultReady(true);
            stopScanner();
        }
    }, []);

    const handleError = useCallback((err) => {
        // Only show error if we were actually scanning
        if (isScanning) {
            showToast('Error scanning QR code. Please try again.', 'error');
        }
    }, [isScanning]);

    const startScanner = async (cameraId = null) => {
        if (videoRef.current) {
            stopScanner();
            
            try {
                qrScannerRef.current = new QrScanner(
                    videoRef.current,
                    handleScan,
                    {
                        preferredCamera: cameraId || undefined,
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                        onDecodeError: handleError,
                        maxScansPerSecond: 2 // Reduce scan rate to minimize logs
                    }
                );
                
                await qrScannerRef.current.start();
                
                // Get available cameras if we haven't already
                if (cameras.length === 0) {
                    const availableCameras = await QrScanner.listCameras(true);
                    setCameras(availableCameras);
                    
                    if (availableCameras.length > 0) {
                        setSelectedCamera(availableCameras[0].id);
                    }
                }
            } catch (err) {
                showToast('Failed to access camera. Please check permissions.', 'error');
                setIsScanning(false);
            }
        }
    };

    const stopScanner = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
            qrScannerRef.current.destroy();
            qrScannerRef.current = null;
        }
    };

    const switchCamera = async (cameraId) => {
        setSelectedCamera(cameraId);
        if (isScanning) {
            await startScanner(cameraId);
        }
    };

    useEffect(() => {
        if (isScanning) {
            startScanner(selectedCamera);
        } else {
            stopScanner();
        }

        return () => {
            stopScanner();
        };
    }, [isScanning]);

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
            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    date,
                    status: 'Present'
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
            showToast('An error occurred while submitting the token.', 'error');
        } finally {
            setLoading(false);
        }
    }, [date]);

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
                        className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-[#F5EEDD] font-medium flex items-center ${
                            toast.type === 'success' ? 'bg-[#077A7D]' : 'bg-[#DDA853]'
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
                    <p className="text-[#A6CDC6] mt-1">Mark your daily attendance</p>
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

                    {/* Attendance Status Card */}
                    {attendanceStatus ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[#7AE2CF]/20 border border-[#7AE2CF] rounded-xl p-6 mb-6 text-center"
                        >
                            <div className="w-16 h-16 bg-[#7AE2CF]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiCheck className="w-8 h-8 text-[#077A7D]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#16404D] mb-1">Attendance Recorded</h3>
                            <p className="text-[#077A7D] mb-2">You marked your attendance at {attendanceStatus.time}</p>
                            <span className="inline-block px-3 py-1 bg-[#7AE2CF]/30 text-[#16404D] rounded-full text-sm font-medium">
                                {attendanceStatus.status}
                            </span>
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
                            <p className="text-[#077A7D] mb-4">Scan your QR code to register your arrival time</p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsScanning(true)}
                                className="px-6 py-3 bg-gradient-to-r from-[#077A7D] to-[#16404D] text-[#F5EEDD] font-medium rounded-lg shadow-md flex items-center mx-auto"
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
                                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                            >
                                <motion.div 
                                    className="bg-[#FBF5DD] rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                >
                                    {/* Scanner Header */}
                                    <div className="bg-gradient-to-r from-[#077A7D] to-[#16404D] text-[#F5EEDD] p-4 flex justify-between items-center">
                                        <h3 className="text-xl font-semibold">Scan QR Code</h3>
                                        <button
                                            onClick={() => setIsScanning(false)}
                                            className="text-[#F5EEDD] hover:text-[#7AE2CF] p-2"
                                        >
                                            <FiX className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Scanner Content */}
                                    <div className="p-4">
                                        <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                                            <video
                                                ref={videoRef}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Scanner Frame Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="border-4 border-[#7AE2CF]/50 rounded-xl w-64 h-64 relative">
                                                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#7AE2CF]"></div>
                                                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#7AE2CF]"></div>
                                                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#7AE2CF]"></div>
                                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#7AE2CF]"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Camera Selection Dropdown */}
                                        {cameras.length > 0 && (
                                            <div className="mt-4 bg-[#F5EEDD] border border-[#A6CDC6] text-[#16404D] px-4 py-2 rounded-lg font-medium">
                                                <div className="flex items-center mb-2">
                                                    <FiVideo className="mr-2 text-[#077A7D]" />
                                                    <span>Select Camera:</span>
                                                </div>
                                                <select
                                                    value={selectedCamera || ''}
                                                    onChange={(e) => switchCamera(e.target.value)}
                                                    className="w-full bg-white border border-[#A6CDC6] rounded px-3 py-1 text-[#16404D]"
                                                >
                                                    {cameras.map((camera) => (
                                                        <option key={camera.id} value={camera.id}>
                                                            {camera.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div className="mt-4 text-center text-[#16404D]">
                                            <p>Position your QR code within the frame</p>
                                        </div>
                                    </div>
                                </motion.div>
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
                                    className="bg-[#FBF5DD] rounded-xl shadow-xl w-full max-w-sm"
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                >
                                    <div className="p-6 text-center">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#7AE2CF]/30 mb-4">
                                            <FiUser className="h-6 w-6 text-[#077A7D]" />
                                        </div>
                                        <h3 className="text-lg font-medium text-[#16404D] mb-2">
                                            Confirm Attendance
                                        </h3>
                                        <p className="text-[#077A7D] mb-6">
                                            Are you sure you want to mark your attendance now?
                                        </p>
                                        <div className="flex justify-center space-x-4">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setIsResultReady(false)}
                                                className="px-6 py-2 border border-[#A6CDC6] rounded-md text-[#16404D] bg-[#F5EEDD] hover:bg-[#A6CDC6]/20"
                                            >
                                                Cancel
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => sendTokenToApi(scanResult)}
                                                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-[#F5EEDD] bg-gradient-to-r from-[#077A7D] to-[#16404D] hover:from-[#16404D] hover:to-[#077A7D]"
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

export default EmployeeAttendancePage;