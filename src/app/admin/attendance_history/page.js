'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FiCalendar, FiDownload, FiInfo, FiXCircle, FiGrid, 
    FiCheckCircle, FiAlertCircle, FiX, FiArrowRight, FiMoon, FiSun 
} from 'react-icons/fi';
import { auth } from '@/app/lib/auth';

// --- EXPORT LIBRARIES ---
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- HELPER FUNCTIONS & COMPONENTS ---

/**
 * --- ENHANCEMENT ---
 * Centralized config for status styles, codes, and compact icons.
 */
const statusConfig = {
    'Present': { bg: 'bg-green-100', text: 'text-green-800', code: 'P', Icon: FiCheckCircle },
    'Late': { bg: 'bg-yellow-100', text: 'text-yellow-800', code: 'L', Icon: FiAlertCircle },
    'Absent': { bg: 'bg-red-100', text: 'text-red-800', code: 'A', Icon: FiX },
    'Leave': { bg: 'bg-blue-100', text: 'text-blue-800', code: 'LV', Icon: FiArrowRight },
    'Half-Day': { bg: 'bg-purple-100', text: 'text-purple-800', code: 'HD', Icon: FiSun },
    'Holiday': { bg: 'bg-sky-100', text: 'text-sky-800', code: 'H', Icon: FiMoon },
    'Weekend': { bg: 'bg-gray-200', text: 'text-gray-700', code: 'W' },
    'Default': { bg: 'bg-gray-100', text: 'text-gray-800', code: 'N/A' },
};

const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const StatusBadge = ({ status, isCompact = false }) => {
    const style = statusConfig[status] || statusConfig['Default'];
    const content = isCompact ? style.code : status.replace('-', ' ');
    return (
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${style.bg} ${style.text}`}>
            {content}
        </span>
    );
};

const AttendanceTooltip = ({ details, holidayName }) => {
    if (holidayName) {
        return (
            <div className="text-center p-1">
                <StatusBadge status="Holiday" />
                <p className="font-bold mt-2 text-gray-700">{holidayName}</p>
            </div>
        );
    }
    if (!details) return null;
    return (
        <div className="space-y-2 text-sm p-1">
            <div className="font-bold text-center border-b pb-1 mb-2 text-gray-700">Details</div>
            <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1">
                <strong>In:</strong> <span className="font-mono text-green-600">{formatTime(details.inTime)}</span>
                <strong>Out:</strong> <span className="font-mono text-red-600">{formatTime(details.outTime)}</span>
                <strong>Status:</strong> <StatusBadge status={details.inStatus || 'Present'} />
                <strong>Hours:</strong> <span className="font-mono">{details.workHours || 'N/A'}</span>
            </div>
        </div>
    );
};

/**
 * --- ENHANCEMENT ---
 * Cell now shows a compact icon/badge by default, saving significant space.
 */
const AttendanceCell = ({ employeeData, dateInfo }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    
    const getCellContent = () => {
        const { isHoliday, dayOfWeek } = dateInfo;
        if (isHoliday) return <StatusBadge status="Holiday" isCompact />;
        if (dayOfWeek === 'S') return <div className="text-xs text-gray-400 font-bold">S</div>;
        if (!employeeData) return <StatusBadge status="Absent" isCompact />;
        
        const { inStatus } = employeeData;
        const status = statusConfig[inStatus] || statusConfig.Default;
        if (status.Icon) {
            return <status.Icon className={`${status.text} mx-auto text-base`} />;
        }
        return <StatusBadge status={inStatus} isCompact />;
    };
    
    const getBackgroundColor = () => {
        if (dateInfo.isHoliday) return 'bg-sky-50/70';
        if (dateInfo.dayOfWeek === 'S') return 'bg-gray-100';
        if (!employeeData) return 'bg-red-50/70';
        return 'bg-white hover:bg-gray-50';
    }

    return (
        <td 
            className={`relative border-b border-gray-200 p-2 text-center transition-all duration-200 cursor-pointer ${getBackgroundColor()}`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {getCellContent()}
            {showTooltip && (employeeData || dateInfo.isHoliday) && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-52 z-20 p-2 bg-white rounded-lg shadow-2xl border before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-white">
                    <AttendanceTooltip details={employeeData} holidayName={dateInfo.holidayName} />
                </div>
            )}
        </td>
    );
};

/**
 * --- ENHANCEMENT ---
 * A more compact, multi-column legend.
 */
const AttendanceLegend = () => (
    <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2"><FiInfo /> Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1">
            {Object.entries(statusConfig)
                .filter(([key]) => key !== 'Default' && key !== 'Weekend')
                .map(([status, { Icon, code }]) => (
                    <div key={status} className="flex items-center gap-2">
                        {Icon ? <Icon className={`${statusConfig[status].text}`} /> : <StatusBadge status={status} />}
                        <span className="text-xs text-gray-600">{status} ({code})</span>
                    </div>
                ))}
        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---

const MonthlyAttendanceReport = () => {
    const router = useRouter();
    const [businessId, setBusinessId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [attendanceData, setAttendanceData] = useState({ employees: new Map(), dates: [] });

    // Effect for user authentication and data fetching remains the same...
    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await auth();
                if (userData === 'No Token') router.push('/login'); else setBusinessId(userData.businessId);
            } catch (err) {
                setError('Authentication failed.'); setLoading(false);
            }
        };
        getUserData();
    }, [router]);
    
    const fetchMonthlyData = useCallback(async (month) => {
        // ... Data fetching logic is unchanged ...
         if (!businessId) return;
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/business/attendance/history?businessId=${businessId}&month=${month}`);
            const result = await response.json();
            if (!result.success) throw new Error(result.msg || 'Failed to fetch data.');
            
            const employeesMap = new Map();
            const datesMap = new Map();
            const [year, monthNum] = month.split('-').map(Number);
            const daysInMonth = new Date(year, monthNum, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(Date.UTC(year, monthNum - 1, day));
                datesMap.set(day, {
                    date,
                    // --- ENHANCEMENT --- Use single letter for day of week
                    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'narrow', timeZone: 'UTC' }),
                    isHoliday: false,
                    holidayName: null,
                });
            }
            
            result.data.forEach(record => {
                const dayOfMonth = new Date(record.date).getUTCDate();
                if (record.isHoliday) {
                    const dayInfo = datesMap.get(dayOfMonth);
                    if (dayInfo) {
                        dayInfo.isHoliday = true;
                        dayInfo.holidayName = record.holidayName;
                    }
                }
                record.employees.forEach(emp => {
                    if (!employeesMap.has(emp.id)) {
                        employeesMap.set(emp.id, { name: emp.name, role: emp.role, attendance: {} });
                    }
                    employeesMap.get(emp.id).attendance[dayOfMonth] = emp;
                });
            });
            setAttendanceData({ employees: employeesMap, dates: Array.from(datesMap.values()) });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [businessId]);

    useEffect(() => {
        if (businessId) fetchMonthlyData(selectedMonth);
    }, [businessId, selectedMonth, fetchMonthlyData]);
    
    // Export functionality remains the same...
     const getExportCellData = (empData, dateInfo) => {
        if (dateInfo.isHoliday) return statusConfig.Holiday.code;
        if (dateInfo.dayOfWeek === 'S') return statusConfig.Weekend.code;
        if (!empData) return statusConfig.Absent.code;
        
        switch(empData.inStatus) {
            case 'Leave': return statusConfig.Leave.code;
            case 'Half-Day': return statusConfig['Half-Day'].code;
            case 'Present':
            case 'Late':
                return `${formatTime(empData.inTime)}-${formatTime(empData.outTime)}`;
            default: return statusConfig.Absent.code;
        }
    };
    const handleExportToExcel = useCallback(() => {
        const headers = ['Employee', ...attendanceData.dates.map(d => d.date.getUTCDate())];
        const body = Array.from(attendanceData.employees.values()).map(emp => 
            [emp.name, ...attendanceData.dates.map((d, i) => getExportCellData(emp.attendance[i + 1], d))]
        );
        const ws = XLSX.utils.aoa_to_sheet([headers, ...body]);
        ws['!cols'] = [{ wch: 25 }, ...headers.slice(1).map(() => ({ wch: 15 }))];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
        XLSX.writeFile(wb, `Attendance_${selectedMonth}.xlsx`);
    }, [attendanceData, selectedMonth]);
    const handleExportToPDF = useCallback(() => {
        const doc = new jsPDF({ orientation: 'landscape' });
        const head = [['Employee', ...attendanceData.dates.map(d => `${d.date.getUTCDate()}${d.dayOfWeek}`)]];
        const body = Array.from(attendanceData.employees.values()).map(emp => 
            [emp.name, ...attendanceData.dates.map((d, i) => getExportCellData(emp.attendance[i + 1], d))]
        );
        autoTable(doc, { head, body, styles: { fontSize: 6 }, headStyles: { fillColor: [44, 62, 80] }, columnStyles: { 0: { minCellWidth: 30 } } });
        doc.save(`Attendance_${selectedMonth}.pdf`);
    }, [attendanceData, selectedMonth]);


    return (
        <div className="bg-slate-50 p-4">
            <div className="w-full mx-auto bg-white rounded-lg shadow-md p-4">
                
                {/* --- ENHANCEMENT --- Compact header */}
                <header className="flex flex-col sm:flex-row justify-between items-center gap-3 border-b pb-4 mb-4">
                    <h1 className="text-xl font-bold text-gray-800">Attendance Register</h1>
                    <div className="flex items-center gap-2">
                        <input 
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-2 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                        <div className="flex items-center gap-1 border-l pl-2">
                           <button title="Export to Excel" onClick={handleExportToExcel} disabled={loading || attendanceData.employees.size === 0} className="p-2 text-green-700 bg-green-100 rounded-md hover:bg-green-200 disabled:opacity-50">
                               <FiDownload />
                           </button>
                           <button title="Export to PDF" onClick={handleExportToPDF} disabled={loading || attendanceData.employees.size === 0} className="p-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200 disabled:opacity-50">
                                <FiDownload />
                           </button>
                        </div>
                    </div>
                </header>

                {loading ? <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
                : error ? <div className="text-center py-10"><FiXCircle className="mx-auto text-red-400 text-4xl mb-2" /><p className="text-red-600">{error}</p></div>
                : attendanceData.employees.size === 0 ? <div className="text-center py-10"><FiGrid className="mx-auto text-gray-400 text-4xl mb-2" /><p className="text-gray-600">No records found.</p></div>
                : (
                    <>
                        <div className="overflow-x-auto custom-scrollbar border rounded-md">
                            <table className="min-w-full border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="sticky left-0 bg-gray-100 z-10 p-2 text-xs font-bold text-gray-600 text-left w-40">Employee</th>
                                        {attendanceData.dates.map(({ dayOfWeek, date }, index) => (
                                            <th key={index} className={`w-10 p-1 text-xs font-semibold border-l ${dayOfWeek === 'S' ? 'bg-gray-200' : ''}`}>
                                                <div>{date.getUTCDate()}</div>
                                                <div className="font-normal text-gray-500">{dayOfWeek}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from(attendanceData.employees.values()).map((emp, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="sticky left-0 bg-white hover:bg-gray-50 p-2 text-sm border-r w-40">
                                                <div className="font-semibold text-gray-800">{emp.name}</div>
                                                <div className="text-xs text-gray-500 truncate">{emp.role}</div>
                                            </td>
                                            {attendanceData.dates.map((dateInfo, index) => (
                                                <AttendanceCell key={index} employeeData={emp.attendance[index + 1]} dateInfo={dateInfo} />
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <AttendanceLegend />
                    </>
                )}
            </div>
        </div>
    );
};

export default MonthlyAttendanceReport;