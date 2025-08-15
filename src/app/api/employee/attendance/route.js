import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { Employee } from "@/app/models/employee";
import { DailyAttendance } from "@/app/models/dailyAttendance";
import { Holiday } from "@/app/models/holiday";
import { BusinessSettings } from "@/app/models/businessSettings";
import { auth } from "@/app/lib/auth";

// Helper: IST midnight
// Helper: Get current time in IST
function getCurrentISTTime() {
    const now = new Date();
    // Get the time in milliseconds for UTC
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    // Add IST offset (5 hours 30 minutes)
    const istTime = new Date(utc + (5.5 * 60 * 60 * 1000));
    return istTime;
}

// Helper: IST midnight
function getTodayIST() {
    const istMidnight = getCurrentISTTime(); // Can now use the helper here
    return new Date(Date.UTC(
        istMidnight.getUTCFullYear(),
        istMidnight.getUTCMonth(),
        istMidnight.getUTCDate(),
        0, 0, 0, 0
    ));
}

// Helper: Convert time string to a Date object based on today's IST date
function timeStringToDateIST(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = getCurrentISTTime(); // This will now work correctly
    now.setHours(hours, minutes, 0, 0);
    return now;
}

// Helper: Convert time string to Date object (less safe across timezones)
function timeStringToDate(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// POST - Mark Attendance
export async function POST(req) {
    try {
        await connectDB();
        const { businessId, inTime, outTime, deviceInfo, coordinates } = await req.json();
        const user = await auth();
        console.log(inTime, outTime);

        const employeeId = user._id;

        if (!employeeId || !businessId) {
            return NextResponse.json({ success: false, msg: 'Employee ID and Business ID are required' }, { status: 400 });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return NextResponse.json({ success: false, msg: 'Employee not found' }, { status: 404 });
        }

        const today = getTodayIST();

        // Get business settings
        const businessSettings = await BusinessSettings.findOne({ business: businessId });
        if (!businessSettings) {
            return NextResponse.json({ success: false, msg: 'Business settings not found' }, { status: 404 });
        }
        console.log(businessSettings);

        // Check if today is a working day
        const todayDay = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
        if (!businessSettings.workingDays.includes(todayDay)) {
            return NextResponse.json({
                success: false,
                msg: `Today is not a working day (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][todayDay]})`
            }, { status: 400 });
        }

        // Holiday check
        const isHoliday = await Holiday.findOne({
            business: businessId,
            date: today,
            isWeeklyHoliday: false
        });
        if (isHoliday) {
            return NextResponse.json({
                success: false,
                msg: `Today is a holiday (${isHoliday.name}).`
            }, { status: 400 });
        }

        // Location verification (if coordinates provided)
        if (coordinates) {
            const { latitude, longitude } = coordinates;
            const distance = calculateDistance(
                latitude,
                longitude,
                businessSettings.coordinates.latitude,
                businessSettings.coordinates.longitude
            );

            if (distance > businessSettings.radiusMeters) {
                return NextResponse.json({
                    success: false,
                    msg: `You are ${distance}m away from the business location (max allowed: ${businessSettings.radiusMeters}m)`
                }, { status: 400 });
            }
        }

        let attendanceRecord = await DailyAttendance.findOne({ date: today, business: businessId });

        if (!attendanceRecord) {
            // First record of the day
            const allEmployees = await Employee.find({ businessName: employee.businessName, active: true,role:"Staff" });
            const attendanceEntries = allEmployees.map(emp => ({
                employee: emp._id,
                inStatus: 'Absent',
                outStatus: 'Absent'
            }));

            attendanceRecord = new DailyAttendance({
                date: today,
                business: businessId,
                employees: attendanceEntries
            });
        }

        // Find employee entry
        const employeeEntry = attendanceRecord.employees.find(e => e.employee.toString() === employeeId);
        if (!employeeEntry) {
            attendanceRecord.employees.push({
                employee: employeeId,
                inStatus: 'Absent',
                outStatus: 'Absent'
            });
        }

        const entry = attendanceRecord.employees.find(e => e.employee.toString() === employeeId);
        function getCurrentISTTime() {
            const now = new Date();
            // Get the time in milliseconds for UTC
            const utc = now.getTime() + now.getTimezoneOffset() * 60000;
            // Add IST offset (5 hours 30 minutes)
            const istTime = new Date(utc + (5.5 * 60 * 60 * 1000));
            return istTime;
        }
        // Mark In-Time
        if (inTime) {
            // Always use current IST time
            entry.inTime = getCurrentISTTime(); // This call now works

            const defaultInTime = timeStringToDateIST(businessSettings.defaultInTime); // This call now works

            const lateThreshold = new Date(defaultInTime);
            lateThreshold.setMinutes(lateThreshold.getMinutes() + businessSettings.gracePeriodMinutes);

            const absentThreshold = new Date(defaultInTime);
            absentThreshold.setMinutes(absentThreshold.getMinutes() + (businessSettings.absentAfterMinutes || 60));
            console.log(entry.inTime, absentThreshold, lateThreshold);

            // if (entry.inTime > absentThreshold) {
            //     entry.inStatus = "Absent";
            // } else 
            function timeToMinutes(t) {
                const [h, m] = t.split(":").map(Number);
                return h * 60 + m;
            }
            function getIST_HHMM(dateValue) {
                return new Date(dateValue).toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                });
            } 
            const inMinutes = timeToMinutes(getIST_HHMM(entry.inTime));
            const lateMinutes = timeToMinutes(getIST_HHMM(lateThreshold));
            const absentMinutes = timeToMinutes(getIST_HHMM(absentThreshold));
            console.log(inMinutes,lateMinutes,absentMinutes);
            
            // if (entry.inTime > lateThreshold) {
            //     entry.inStatus = "Late";
            // } else {
            //     entry.inStatus = "On Time";
            // }
           if (inMinutes > lateMinutes) {
                entry.inStatus = "Late";
            } else {
                entry.inStatus = "On Time";
            }
        }

        // Mark Out-Time
        if (outTime) {
            entry.outTime = new Date(outTime);

            // Calculate early leave threshold based on business settings
            const defaultOutTime = timeStringToDate(businessSettings.defaultOutTime);
            const earlyLeaveThreshold = new Date(defaultOutTime);
            earlyLeaveThreshold.setMinutes(earlyLeaveThreshold.getMinutes() - businessSettings.gracePeriodMinutes);

            entry.outStatus = entry.outTime < earlyLeaveThreshold ? 'Early Leave' : 'On Time';
            entry.deviceInfo = deviceInfo || entry.deviceInfo;
        }

        // Calculate work hours if both in & out exist
        if (entry.inTime && entry.outTime) {
            const diff = entry.outTime - entry.inTime;
            entry.workHours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));

            // Deduct lunch break if applicable
            if (businessSettings.lunchDurationMinutes > 0) {
                const lunchBreakHours = businessSettings.lunchDurationMinutes / 60;
                entry.workHours = Math.max(0, entry.workHours - lunchBreakHours);
            }
        }

        await attendanceRecord.save();

        return NextResponse.json({
            success: true,
            msg: 'Attendance marked successfully',
            data: {
                inStatus: entry.inStatus,
                outStatus: entry.outStatus,
                workHours: entry.workHours
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error marking attendance:', error);
        return NextResponse.json({
            success: false,
            msg: 'Error marking attendance',
            error: error.message
        }, { status: 500 });
    }
}

// Helper: Calculate distance between two coordinates in meters
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
}

// GET - Get Today's Attendance for an Employee
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const employeeId = searchParams.get('employeeId');
        const businessId = searchParams.get('businessId');

        if (!employeeId || !businessId) {
            return NextResponse.json({ success: false, msg: 'Employee ID and Business ID are required' }, { status: 400 });
        }

        const today = getTodayIST();

        const attendanceRecord = await DailyAttendance.findOne({
            date: today,
            business: businessId,
            'employees.employee': employeeId
        }).populate('employees.employee', 'name email role department');

        if (!attendanceRecord) {
            return NextResponse.json({ success: true, msg: 'No attendance recorded for today', data: null }, { status: 200 });
        }

        const employeeAttendance = attendanceRecord.employees.find(e => e.employee._id.toString() === employeeId);
        if (!employeeAttendance) {
            return NextResponse.json({ success: true, msg: 'No attendance found for this employee today', data: null }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            msg: 'Employee attendance retrieved successfully',
            data: {
                date: attendanceRecord.date,
                inTime: employeeAttendance.inTime,
                outTime: employeeAttendance.outTime,
                inStatus: employeeAttendance.inStatus,
                outStatus: employeeAttendance.outStatus,
                workHours: employeeAttendance.workHours,
                notes: employeeAttendance.notes,
                deviceInfo: employeeAttendance.deviceInfo,
                employee: employeeAttendance.employee
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching employee attendance:', error);
        return NextResponse.json({ success: false, msg: 'Error fetching employee attendance', error: error.message }, { status: 500 });
    }
}
