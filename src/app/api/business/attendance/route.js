import connectDB from "@/app/lib/dbconnect";
import { Holiday } from "@/app/models/holiday";
import { DailyAttendance } from "@/app/models/dailyAttendance";
import { NextResponse } from "next/server";

const log = (level, message, data = {}) => {
    const timestamp = new Date().toISOString();
    const colors = {
        info: "\x1b[36m%s\x1b[0m",   // cyan
        success: "\x1b[32m%s\x1b[0m", // green
        warn: "\x1b[33m%s\x1b[0m",    // yellow
        error: "\x1b[31m%s\x1b[0m"    // red
    };

    console.log(colors[level] || "%s", `[${timestamp}] [${level.toUpperCase()}] ${message}`, data);
};

export async function GET(req) {
    try {
        log("info", "Attendance API called", { url: req.url });

        await connectDB();
        log("success", "Database connection established");

        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get("businessId");

        if (!businessId) {
            log("warn", "Business ID missing in request");
            return NextResponse.json({
                success: false,
                msg: "Business ID is required"
            }, { status: 400 });
        }

        log("info", "Processing attendance request", { businessId });

        const today = new Date();
        // today.setHours(0, 0, 0, 0);
        today.setUTCHours(0, 0, 0, 0);

        // Check if today is a holiday
        const isHoliday = await Holiday.findOne({
            business: businessId,
            date: today
        });

        if (isHoliday) {
            log("success", "Holiday detected", {
                name: isHoliday.name,
                description: isHoliday.description
            });
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
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const isWeeklyHoliday = await Holiday.findOne({
            business: businessId,
            isWeeklyHoliday: true,
            $or: [
                { recurrencePattern: "weekly" },
                {
                    recurrencePattern: "yearly",
                    $expr: {
                        $and: [
                            { $eq: [{ $month: "$date" }, month] },
                            { $eq: [{ $dayOfMonth: "$date" }, day] }
                        ]
                    }
                }
            ]
        });

        if (isWeeklyHoliday) {
            log("success", "Weekly holiday detected", {
                name: isWeeklyHoliday.name,
                description: isWeeklyHoliday.description
            });
            return NextResponse.json({
                success: true,
                msg: `Today is a weekly holiday (${isWeeklyHoliday.name})`,
                isHoliday: true,
                holidayName: isWeeklyHoliday.name,
                holidayDescription: isWeeklyHoliday.description,
                data: null
            }, { status: 200 });
        }

        // Fetch attendance
        const attendanceRecord = await DailyAttendance.findOne({
            date: today,
            business: businessId
        })
        console.log(today);
        
        if (!attendanceRecord) {
            log("warn", "No attendance record found for today");
            return NextResponse.json({
                success: true,
                msg: "No attendance recorded today",
                data: null
            }, { status: 200 });
        }

        log("success", "Attendance record retrieved", { count: attendanceRecord.employees.length });
        return NextResponse.json({
            success: true,
            msg: "Attendance retrieved successfully",
            data: attendanceRecord
        }, { status: 200 });

    } catch (error) {
        log("error", "Error fetching attendance", { error: error.message, stack: error.stack });
        return NextResponse.json({
            success: false,
            msg: "Error fetching attendance",
            error: error.message
        }, { status: 500 });
    }
}
