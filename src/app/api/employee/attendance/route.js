import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { Employee } from "@/app/models/employee";
import { DailyAttendance } from "@/app/models/dailyAttendance";
import { Holiday } from "@/app/models/holiday";
import { auth } from "@/app/lib/auth";

export async function POST(req) {
    try {
        await connectDB();
        // const { employeeId, businessId, inTime, outTime, deviceInfo } = await req.json();
        const { token, inTime, outTime, deviceInfo } = await req.json();
        const user = await auth();
        console.log(deviceInfo);

        console.log(user);
        // const businessId = user.businessId;
        const businessId = token;
        const employeeId = user._id;
        console.log(businessId, employeeId);

        // Validate required fields
        if (!employeeId || !businessId) {
            return NextResponse.json({
                success: false,
                msg: 'Employee ID and Business ID are required'
            }, { status: 400 });
        }

        // Get the employee details
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return NextResponse.json({
                success: false,
                msg: 'Employee not found'
            }, { status: 404 });
        }

        // Get current date at midnight for consistent date comparison
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istMidnight = new Date(utc + istOffset);

        const today = new Date(
            Date.UTC(
                istMidnight.getUTCFullYear(),
                istMidnight.getUTCMonth(),
                istMidnight.getUTCDate(),
                0, 0, 0, 0
            )
        );

        // Check if today is a holiday
        const isHoliday = await Holiday.findOne({
            business: businessId,
            date: today
        });

        if (isHoliday) {
            return NextResponse.json({
                success: false,
                msg: `Today is a holiday (${isHoliday.name}). Attendance cannot be marked.`
            }, { status: 400 });
        }

        // Check if today is a weekly holiday (Sunday = 0, Saturday = 6)
        const dayOfWeek = today.getDay();
        const isWeeklyHoliday = await Holiday.findOne({
            business: businessId,
            $or: [
                {
                    isWeeklyHoliday: true,
                    recurrencePattern: 'weekly'
                },
                {
                    recurrencePattern: 'yearly',
                    $expr: {
                        $and: [
                            { $eq: [{ $month: "$date" }, today.getMonth() + 1] },
                            { $eq: [{ $dayOfMonth: "$date" }, today.getDate()] }
                        ]
                    }
                }
            ]
        });


        if (isWeeklyHoliday) {
            return NextResponse.json({
                success: false,
                msg: `Today is a weekly holiday (${isWeeklyHoliday.name}). Attendance cannot be marked.`
            }, { status: 400 });
        }

        // Find or create today's attendance record
        let attendanceRecord = await DailyAttendance.findOne({
            date: today,
            business: businessId
        });

        if (!attendanceRecord) {
            // If no record exists (first employee marking attendance today)
            // Create new record and mark all other employees as absent
            const allEmployees = await Employee.find({
                businessName: employee.businessName,
                active: true
            });

            const attendanceEntries = allEmployees.map(emp => ({
                employee: emp._id,
                status: emp._id.toString() === employeeId ? 'Present' : 'Absent',
                ...(emp._id.toString() === employeeId && {
                    inTime: inTime || new Date(),
                    deviceInfo: deviceInfo || null
                })
            }));

            attendanceRecord = new DailyAttendance({
                date: today,
                business: businessId,
                employees: attendanceEntries
            });
        } else {
            // Update existing record for this employee
            const employeeEntryIndex = attendanceRecord.employees.findIndex(
                entry => entry.employee.toString() === employeeId
            );

            if (employeeEntryIndex === -1) {
                // Employee not in today's attendance yet, add them
                attendanceRecord.employees.push({
                    employee: employeeId,
                    inTime: inTime || new Date(),
                    outTime: outTime || null,
                    deviceInfo: deviceInfo || null,
                    status: 'Present'
                });
            } else {
                // Update existing entry
                // Update existing entry
                const updateFields = {};
                if (inTime) updateFields['employees.$[elem].inTime'] = inTime;
                if (outTime) updateFields['employees.$[elem].outTime'] = outTime;
                if (deviceInfo) updateFields['employees.$[elem].deviceInfo'] = deviceInfo;

                // Always mark status as 'Present' when updating
                updateFields['employees.$[elem].status'] = 'Present';

                await DailyAttendance.updateOne(
                    {
                        _id: attendanceRecord._id,
                        "employees.employee": employeeId
                    },
                    {
                        $set: updateFields
                    },
                    {
                        arrayFilters: [{ "elem.employee": employeeId }]
                    }
                );

            }
        }

        // Recalculate totals
        const totalPresent = attendanceRecord.employees.filter(emp => emp.status === 'Present').length;
        const totalAbsent = attendanceRecord.employees.filter(emp => emp.status === 'Absent').length;

        attendanceRecord.totalPresent = totalPresent;
        attendanceRecord.totalAbsent = totalAbsent;

        // Save the attendance record
        await attendanceRecord.save();


        return NextResponse.json({
            success: true,
            msg: 'Attendance marked successfully',
            data: attendanceRecord
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

// API to get today's attendance
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const employeeId = searchParams.get('employeeId');
        const businessId = searchParams.get('businessId');

        // Validate required parameters
        if (!employeeId) {
            return NextResponse.json({
                success: false,
                msg: 'Employee ID is required'
            }, { status: 400 });
        }

        if (!businessId) {
            return NextResponse.json({
                success: false,
                msg: 'Business ID is required'
            }, { status: 400 });
        }
        // Get today's date at midnight IST
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istMidnight = new Date(utc + istOffset);

        const today = new Date(
            Date.UTC(
                istMidnight.getUTCFullYear(),
                istMidnight.getUTCMonth(),
                istMidnight.getUTCDate(),
                0, 0, 0, 0
            )
        );

        // Optional debug
        console.log("IST Midnight (in UTC):", today); // This is correct



        // Find today's attendance record for the business
        const attendanceRecord = await DailyAttendance.findOne({
            date: today,
            business: businessId,
            'employees.employee': employeeId
        }).populate('employees.employee', 'name email role department');

        if (!attendanceRecord) {
            return NextResponse.json({
                success: true,
                msg: 'No attendance recorded for today',
                data: null
            }, { status: 200 });
        }

        // Extract the specific employee's attendance from the records
        const employeeAttendance = attendanceRecord.employees.find(
            emp => emp.employee._id.toString() === employeeId
        );

        if (!employeeAttendance) {
            return NextResponse.json({
                success: true,
                msg: 'No attendance found for this employee today',
                data: null
            }, { status: 200 });
        }

        // Format the response data
        const responseData = {
            date: attendanceRecord.date,
            inTime: employeeAttendance.inTime,
            outTime: employeeAttendance.outTime,
            status: employeeAttendance.status,
            workHours: employeeAttendance.workHours,
            notes: employeeAttendance.notes,
            deviceInfo: employeeAttendance.deviceInfo,
            employee: employeeAttendance.employee
        };

        return NextResponse.json({
            success: true,
            msg: 'Employee attendance retrieved successfully',
            data: responseData
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching employee attendance:', error);
        return NextResponse.json({
            success: false,
            msg: 'Error fetching employee attendance',
            error: error.message
        }, { status: 500 });
    }
}