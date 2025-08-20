import connectDB from "@/app/lib/dbconnect";
import { Holiday } from "@/app/models/holiday";
import { DailyAttendance } from "@/app/models/dailyAttendance";
import { NextResponse } from "next/server";

/**
 * Custom logger function to display formatted messages in the console.
 * @param {string} level - The log level (e.g., 'info', 'success', 'warn', 'error').
 * @param {string} message - The message to log.
 * @param {object} data - Additional data to log as a JSON string.
 */
const log = (level, message, data = {}) => {
    const timestamp = new Date().toISOString();
    const colors = {
        info: "\x1b[36m%s\x1b[0m",    // cyan
        success: "\x1b[32m%s\x1b[0m", // green
        warn: "\x1b[33m%s\x1b[0m",    // yellow
        error: "\x1b[31m%s\x1b[0m"    // red
    };

    // Log the message with color coding and additional data.
    console.log(colors[level] || "%s", `[${timestamp}] [${level.toUpperCase()}] ${message}`, JSON.stringify(data, null, 2));
};

export async function GET(req) {
    try {
        log("info", "Attendance API called", { url: req.url });

        await connectDB();
        log("success", "Database connection established");

        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get("businessId");
        const dateParam = searchParams.get("date"); // Get the date from search params

        if (!businessId) {
            log("warn", "Business ID missing in request");
            return NextResponse.json({
                success: false,
                msg: "Business ID is required"
            }, { status: 400 });
        }

        // --- MODIFICATION START ---
        // Determine the target date.
        // If a date parameter is provided, construct the Date object by explicitly setting it as UTC midnight.
        // This prevents timezone-related issues where the server's local time might shift the date.
        let targetDate;
        if (dateParam) {
            // By appending T00:00:00.000Z, we ensure the string is parsed as UTC.
            targetDate = new Date(`${dateParam}T00:00:00.000Z`);
            console.log(targetDate);

        } else {
            // If no date is provided, default to the start of today in UTC.
            targetDate = new Date();
            targetDate.setUTCHours(0, 0, 0, 0);
        }
        // --- MODIFICATION END ---

        console.log("info", "Processing attendance request", { businessId, date: targetDate.toISOString().split('T')[0] });

        // Check if the target date is a specific holiday
        const isHoliday = await Holiday.findOne({
            business: businessId,
            date: targetDate
        });

        if (isHoliday) {
            log("success", "Holiday detected", {
                name: isHoliday.name,
                description: isHoliday.description
            });
            return NextResponse.json({
                success: true,
                msg: `The selected date is a holiday (${isHoliday.name})`,
                isHoliday: true,
                holidayName: isHoliday.name,
                holidayDescription: isHoliday.description,
                data: null
            }, { status: 200 });
        }

        // Check if the target date is a weekly or recurring yearly holiday
        const month = targetDate.getUTCMonth() + 1;
        const day = targetDate.getUTCDate();
        const dayOfWeek = targetDate.getUTCDay(); // 0 for Sunday, 1 for Monday, etc.

        const isWeeklyHoliday = await Holiday.findOne({
            business: businessId,
            isWeeklyHoliday: true,
            $or: [
                // Weekly holidays based on the day of the week
                { recurrencePattern: "weekly", dayOfWeek: dayOfWeek },
                // Yearly recurring holidays based on month and day
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
            log("success", "Weekly/Recurring holiday detected", {
                name: isWeeklyHoliday.name,
                description: isWeeklyHoliday.description
            });
            return NextResponse.json({
                success: true,
                msg: `The selected date is a weekly holiday (${isWeeklyHoliday.name})`,
                isHoliday: true,
                holidayName: isWeeklyHoliday.name,
                holidayDescription: isWeeklyHoliday.description,
                data: null
            }, { status: 200 });
        }
        console.log(targetDate);
        console.log(businessId);
        function convertDateFormat(dateString) {
            const date = new Date(dateString);

            // ✅ Add 1 day
            date.setUTCDate(date.getUTCDate());

            // ✅ Force to midnight UTC
            date.setUTCHours(0, 0, 0, 0);

            // ✅ Convert to ISO string with +00:00 instead of 'Z'
            return date.toISOString().replace("Z", "+00:00");
        }
        const formatteddate = convertDateFormat(targetDate);
        console.log("Hey I am the formatted date", formatteddate);

        // Fetch attendance for the target date
        const attendanceRecord = await DailyAttendance.findOne({
            date: formatteddate,
            business: businessId
        });

        if (!attendanceRecord) {
            log("warn", "No attendance record found for the specified date", { date: targetDate.toISOString().split('T')[0] });
            return NextResponse.json({
                success: true,
                msg: "No attendance recorded for the selected date",
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
