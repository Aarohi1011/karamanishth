import connectDB from "@/app/lib/dbconnect";
import { DailyAttendance } from "@/app/models/dailyAttendance";
import { Holiday } from "@/app/models/holiday";
import { NextResponse } from "next/server";
import { Employee } from "@/app/models/employee";
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const monthParam = searchParams.get("month"); // Format: YYYY-MM

    if (!businessId || !monthParam) {
      return NextResponse.json(
        { success: false, msg: "Business ID and Month are required" },
        { status: 400 }
      );
    }

    const [year, month] = monthParam.split("-").map(Number);
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        { success: false, msg: "Invalid month format. Use YYYY-MM" },
        { status: 400 }
      );
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    // Fetch all holidays for this business
    const holidays = await Holiday.find({ business: businessId });

    // Function to check if a date is a holiday
    const getHolidayForDate = (date) => {
      const time = new Date(date).setHours(0, 0, 0, 0);
      for (const h of holidays) {
        if (h.recurring) {
          if (h.recurrencePattern === "yearly") {
            if (
              h.date.getDate() === new Date(time).getDate() &&
              h.date.getMonth() === new Date(time).getMonth()
            )
              return h;
          } else if (h.recurrencePattern === "monthly") {
            if (h.date.getDate() === new Date(time).getDate()) return h;
          } else if (h.recurrencePattern === "weekly") {
            if (h.date.getDay() === new Date(time).getDay()) return h;
          }
        } else if (new Date(h.date).getTime() === time) {
          return h;
        }
      }
      return null;
    };

    // Fetch daily attendance records for the month
    const attendanceRecords = await DailyAttendance.find({
      business: businessId,
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: 1 })
      .populate("employees.employee", "name role");

    // Build history array
    const history = attendanceRecords.map((record) => {
      const holiday = getHolidayForDate(record.date);

      return {
        date: record.date,
        isHoliday: !!holiday,
        holidayName: holiday ? holiday.name : null,
        employees: record.employees.map((emp) => ({
          id: emp.employee._id,
          name: emp.employee.name,
          role: emp.employee.role,
          inTime: emp.inTime,
          outTime: emp.outTime,
          inStatus: emp.inStatus,
          outStatus: emp.outStatus,
          workHours: emp.workHours,
          notes: emp.notes,
          deviceInfo: emp.deviceInfo,
        })),
      };
    });

    return NextResponse.json(
      {
        success: true,
        msg: "Monthly attendance history retrieved successfully",
        data: history,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching monthly attendance history:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Error fetching monthly attendance history",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
