import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { Employee } from "@/app/models/employee";
import { DailyAttendance } from "@/app/models/dailyAttendance";
import { Holiday } from "@/app/models/holiday";

export async function POST(req) {
    try {
        await connectDB();
        const { employeeId, businessId, inTime, outTime, deviceInfo } = await req.json();

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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

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
            isWeeklyHoliday: true,
            $or: [
                { recurrencePattern: 'weekly' },
                { 
                    recurrencePattern: 'yearly',
                    date: { 
                        $expr: { 
                            $and: [
                                { $eq: [{ $month: "$date" }, today.getMonth() + 1] },
                                { $eq: [{ $dayOfMonth: "$date" }, today.getDate()] }
                            ]
                        }
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
                const updateFields = {};
                if (inTime) updateFields['employees.$[elem].inTime'] = inTime;
                if (outTime) updateFields['employees.$[elem].outTime'] = outTime;
                if (deviceInfo) updateFields['employees.$[elem].deviceInfo'] = deviceInfo;
                
                // Update status based on what's being updated
                if (outTime) {
                    updateFields['employees.$[elem].status'] = 'Present';
                }

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
        const businessId = searchParams.get('businessId');

        if (!businessId) {
            return NextResponse.json({
                success: false,
                msg: 'Business ID is required'
            }, { status: 400 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if today is a holiday
        const isHoliday = await Holiday.findOne({
            business: businessId,
            date: today
        });

        if (isHoliday) {
            return NextResponse.json({
                success: true,
                msg: `Today is a holiday (${isHoliday.name})`,
                isHoliday: true,
                holidayName: isHoliday.name,
                holidayDescription: isHoliday.description,
                data: null
            }, { status: 200 });
        }

        // Check if today is a weekly holiday
        const dayOfWeek = today.getDay();
        const isWeeklyHoliday = await Holiday.findOne({
            business: businessId,
            isWeeklyHoliday: true,
            $or: [
                { recurrencePattern: 'weekly' },
                { 
                    recurrencePattern: 'yearly',
                    date: { 
                        $expr: { 
                            $and: [
                                { $eq: [{ $month: "$date" }, today.getMonth() + 1] },
                                { $eq: [{ $dayOfMonth: "$date" }, today.getDate()] }
                            ]
                        }
                    }
                }
            ]
        });

        if (isWeeklyHoliday) {
            return NextResponse.json({
                success: true,
                msg: `Today is a weekly holiday (${isWeeklyHoliday.name})`,
                isHoliday: true,
                holidayName: isWeeklyHoliday.name,
                holidayDescription: isWeeklyHoliday.description,
                data: null
            }, { status: 200 });
        }

        const attendanceRecord = await DailyAttendance.findOne({
            date: today,
            business: businessId
        }).populate('employees.employee', 'name role');

        if (!attendanceRecord) {
            return NextResponse.json({
                success: true,
                msg: 'No attendance recorded today',
                data: null
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            msg: 'Attendance retrieved successfully',
            data: attendanceRecord
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching attendance:', error);
        return NextResponse.json({
            success: false,
            msg: 'Error fetching attendance',
            error: error.message
        }, { status: 500 });
    }
}