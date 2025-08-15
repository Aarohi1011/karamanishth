import connectDB from "@/app/lib/dbconnect";
import { Holiday } from "@/app/models/holiday";
import { DailyAttendance } from "@/app/models/dailyAttendance";
import { NextResponse } from "next/server";

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

    // Fetch holidays for the business
    const holidays = await Holiday.find({ business: businessId });

    // Function to check if a date is a holiday
    const isHoliday = (date) => {
      const time = new Date(date).setHours(0, 0, 0, 0);

      for (const h of holidays) {
        if (h.recurring) {
          if (h.recurrencePattern === "yearly") {
            if (h.date.getDate() === new Date(time).getDate() &&
                h.date.getMonth() === new Date(time).getMonth()) {
              return h;
            }
          } else if (h.recurrencePattern === "monthly") {
            if (h.date.getDate() === new Date(time).getDate()) {
              return h;
            }
          } else if (h.recurrencePattern === "weekly") {
            if (h.date.getDay() === new Date(time).getDay()) {
              return h;
            }
          }
        } else if (new Date(h.date).getTime() === time) {
          return h;
        }
      }
      return null;
    };

    // Fetch attendance records
    const attendanceRecords = await DailyAttendance.find({
      business: businessId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("employees.employee", "name role");

    // Initialize analysis
    const analysis = {
      month: monthParam,
      totalDays: endDate.getDate(),
      workingDays: 0,
      holidays: 0,
      weeklyHolidays: 0,
      specialHolidays: 0,
      totalEmployees: 0,
      dailyStats: [],
      employeeStats: {},
      summary: {
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        totalHalfDay: 0,
        totalHolidays: 0,
        averageAttendance: 0,
      },
    };

    // Count weekly holidays (Sunday = 0)
    const weeklyOffDay = 0;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const holidayObj = isHoliday(currentDate);
      if (currentDate.getDay() === weeklyOffDay) analysis.weeklyHolidays++;
      if (holidayObj) analysis.holidays++;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    analysis.specialHolidays = analysis.holidays - analysis.weeklyHolidays;
    analysis.workingDays = analysis.totalDays - analysis.holidays;

    const normalizeDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    };

    // Process attendance records
    for (const record of attendanceRecords) {
      const dayStats = {
        date: record.date,
        isHoliday: false,
        holidayName: null,
        totalEmployees: record.employees.length,
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
      };

      const recordDateTime = normalizeDate(record.date);
      const holiday = isHoliday(record.date);

      if (holiday) {
        dayStats.isHoliday = true;
        dayStats.holidayName = holiday.name;
      } else {
        for (const emp of record.employees) {
          const empStats =
            analysis.employeeStats[emp.employee._id] ||
            (analysis.employeeStats[emp.employee._id] = {
              name: emp.employee.name,
              role: emp.employee.role,
              present: 0,
              absent: 0,
              late: 0,
              halfDay: 0,
              totalDays: 0,
            });

          empStats.totalDays++;

          // Attendance logic
          if (emp.inStatus !== "Absent" && emp.outStatus !== "Absent") {
            dayStats.present++;
            empStats.present++;
            analysis.summary.totalPresent++;
          } else if (emp.inStatus === "Absent" || emp.outStatus === "Absent") {
            dayStats.absent++;
            empStats.absent++;
            analysis.summary.totalAbsent++;
          }

          if (emp.inStatus === "Late") {
            dayStats.late++;
            empStats.late++;
            analysis.summary.totalLate++;
          }

          if (emp.inStatus === "Half-Day" || emp.outStatus === "Half-Day") {
            dayStats.halfDay++;
            empStats.halfDay++;
            analysis.summary.totalHalfDay++;
          }
        }
      }

      analysis.dailyStats.push(dayStats);
    }

    // Total employees
    if (attendanceRecords.length > 0) {
      analysis.totalEmployees = attendanceRecords[0].employees.length;
    }

    // Calculate average attendance %
    if (analysis.workingDays > 0 && analysis.totalEmployees > 0) {
      const totalPossible = analysis.workingDays * analysis.totalEmployees;
      const actual =
        analysis.summary.totalPresent +
        analysis.summary.totalLate +
        analysis.summary.totalHalfDay * 0.5;
      analysis.summary.averageAttendance = parseFloat(
        ((actual / totalPossible) * 100).toFixed(2)
      );
    }

    return NextResponse.json(
      {
        success: true,
        msg: "Monthly attendance analysis retrieved successfully",
        data: analysis,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching monthly attendance analysis:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Error fetching monthly attendance analysis",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
