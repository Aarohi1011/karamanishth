import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import Payroll from "@/app/models/payroll";
import { Employee } from "@/app/models/employee";
import { Business } from "@/app/models/business";
import { DailyAttendance } from "@/app/models/dailyAttendance"; // ✅ IMPORT
import { Holiday } from "@/app/models/holiday"; // ✅ IMPORT
import { BusinessSettings } from "@/app/models/businessSettings"; // ✅ IMPORT
import { auth } from "@/app/lib/auth";

// ✅ CREATE Payroll (POST) - No changes needed
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // Check Employee Exists
    const employee = await Employee.findById(data.employee);
    if (!employee) {
      return NextResponse.json({ success: false, msg: "Employee not found" }, { status: 404 });
    }

    // Check Business Exists
    const business = await Business.findById(data.businessId);
    if (!business) {
      return NextResponse.json({ success: false, msg: "Business not found" }, { status: 404 });
    }

    // Prevent duplicate payroll for same employee in same month/year
    const exists = await Payroll.findOne({
      employee: data.employee,
      businessId: data.businessId,
      month: data.month,
      year: data.year,
    });

    if (exists) {
      return NextResponse.json({ success: false, msg: "Payroll already exists for this period" }, { status: 400 });
    }

    const payroll = await Payroll.create(data);

    return NextResponse.json({ success: true, msg: "Payroll created", payroll }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, msg: "Error creating payroll", error }, { status: 500 });
  }
}

// ✅ GET Payrolls (with Auto-Generation & Attendance Calculation)
export async function GET(req) {
  try {
    console.log("\x1b[34m📡 [REQUEST] Incoming GET /api/payrolls\x1b[0m");
    await connectDB();
    const user = await auth();
    console.log("\x1b[32m✅ [DB] Connected successfully\x1b[0m");

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const employeeId = searchParams.get("employeeId");
    const month = parseInt(searchParams.get("month"), 10);
    const year = parseInt(searchParams.get("year"), 10);

    if (!businessId || !month || !year) {
      return NextResponse.json(
        { success: false, msg: "businessId, month, and year are required" },
        { status: 400 }
      );
    }

    let filter = { businessId, month, year };
    if (employeeId) filter.employee = employeeId;

    let payrolls = await Payroll.find(filter)
      .populate("employee", "name email phone role salary")
      .populate("businessId", "businessName businessType");

    if (payrolls.length === 0 && !employeeId) {
      console.log("\x1b[33m⚠️ [ACTION] No payrolls found → Generating pending payrolls with detailed stats\x1b[0m");

      // =================================================================
      // 1. FETCH & CALCULATE BUSINESS-WIDE DATA
      // =================================================================
      
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const settings = await BusinessSettings.findOne({ business: businessId });
      if (!settings) {
          return NextResponse.json({ success: false, msg: "Business settings not found" }, { status: 404 });
      }
      
      const workingDaysOfWeek = new Set(settings.workingDays);
      const holidays = await Holiday.find({ business: businessId, date: { $gte: startDate, $lte: endDate } });
      const holidayDates = new Set(holidays.map(h => h.date.toISOString().split('T')[0]));
      
      const dailyAttendances = await DailyAttendance.find({ business: businessId, date: { $gte: startDate, $lte: endDate } });
      const attendanceMap = new Map();
      dailyAttendances.forEach(att => attendanceMap.set(att.date.toISOString().split('T')[0], att));

      let totalWorkingDaysInMonth = 0;
      for (let day = 1; day <= endDate.getDate(); day++) {
          const currentDate = new Date(year, month - 1, day);
          const dayOfWeek = currentDate.getDay();
          const dateString = currentDate.toISOString().split('T')[0];
          if (workingDaysOfWeek.has(dayOfWeek) && !holidayDates.has(dateString)) {
              totalWorkingDaysInMonth++;
          }
      }

      // Calculate standard daily and monthly business hours
      const [outH, outM] = settings.defaultOutTime.split(':').map(Number);
      const [inH, inM] = settings.defaultInTime.split(':').map(Number);
      const shiftDurationHours = (outH - inH) + (outM - inM) / 60;
      const dailyBusinessWorkHours = shiftDurationHours - (settings.lunchDurationMinutes / 60);
      const totalBusinessHoursInMonth = parseFloat((dailyBusinessWorkHours * totalWorkingDaysInMonth).toFixed(2));

      // =================================================================
      // 2. GENERATE PAYROLL FOR EACH EMPLOYEE WITH DETAILED STATS
      // =================================================================
      const employees = await Employee.find({ businessName: user.businessName, role: "Staff" });
      if (employees.length === 0) {
        return NextResponse.json({ success: false, msg: "No Staff employees found" }, { status: 404 });
      }
      
      const newPayrollsData = employees.map(emp => {
          // ✅ NEW: Initialize counters for detailed stats
          let presentDays = 0, absentDays = 0, leaveDays = 0, halfDays = 0;
          let totalWorkHours = 0, overtimeHours = 0, holidayWorkDays = 0, holidayWorkHours = 0;
          
          const basicSalary = Number(emp.salary) || 0;

          // Iterate through all days of the month to calculate stats for this employee
          for (let day = 1; day <= endDate.getDate(); day++) {
              const currentDate = new Date(year, month - 1, day);
              const dayOfWeek = currentDate.getDay();
              const dateString = currentDate.toISOString().split('T')[0];

              const isHoliday = holidayDates.has(dateString);
              const isWorkingDay = workingDaysOfWeek.has(dayOfWeek) && !isHoliday;

              const attendanceRecord = attendanceMap.get(dateString);
              const empAttendance = attendanceRecord?.employees.find(e => e.employee.toString() === emp._id.toString());
              
              // ✅ NEW: Detailed daily calculation logic
              if (empAttendance && empAttendance.inStatus !== 'Absent') {
                  const dailyHours = empAttendance.workHours || 0;
                  totalWorkHours += dailyHours;

                  if (isHoliday) {
                      holidayWorkDays++;
                      holidayWorkHours += dailyHours;
                  } else if (isWorkingDay) {
                      // Calculate overtime only on normal working days
                      const dailyOvertime = dailyHours - dailyBusinessWorkHours;
                      if (dailyOvertime > 0) {
                          overtimeHours += dailyOvertime;
                      }

                      // Count presence status
                      switch (empAttendance.inStatus) {
                          case 'On Time': case 'Late': presentDays++; break;
                          case 'Half-Day': halfDays++; break;
                          case 'Leave': leaveDays++; break;
                      }
                  }
              } else {
                  // Employee is absent only if it's a working day and they didn't show up
                  if (isWorkingDay) {
                      absentDays++;
                  }
              }
          }
          
          return {
              employee: emp._id,
              businessId,
              month,
              year,
              basicSalary,
              grossSalary: basicSalary,
              totalDeductions: 0,
              netSalary: basicSalary,
              paymentStatus: "pending",
              
              // Business-wide stats
              totalWorkingDays: totalWorkingDaysInMonth,
              totalBusinessHours: totalBusinessHoursInMonth,

              // Employee presence stats
              presentDays,
              absentDays,
              leaveDays,
              halfDays,

              // ✅ NEW: Detailed employee work hour stats
              totalWorkHours: parseFloat(totalWorkHours.toFixed(2)),
              overtimeHours: parseFloat(overtimeHours.toFixed(2)),
              holidayWorkDays,
              holidayWorkHours: parseFloat(holidayWorkHours.toFixed(2)),
          };
      });
      
      await Payroll.insertMany(newPayrollsData);

      payrolls = await Payroll.find(filter)
        .populate("employee", "name email phone role salary")
        .populate("businessId", "businessName businessType");
    }

    return NextResponse.json(
      { success: true, count: payrolls.length, payrolls },
      { status: 200 }
    );
  } catch (error) {
    console.error("\x1b[31m🔥 [EXCEPTION] Error fetching payrolls\x1b[0m", error);
    return NextResponse.json(
      { success: false, msg: "Error fetching payrolls", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ UPDATE Payroll (PUT) - No changes needed
export async function PUT(req) {
  try {
    await connectDB();
    const { id, updates } = await req.json(); // expects {id, updates:{}}

    const payroll = await Payroll.findByIdAndUpdate(id, updates, { new: true });
    if (!payroll) {
      return NextResponse.json({ success: false, msg: "Payroll not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, msg: "Payroll updated", payroll }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, msg: "Error updating payroll", error }, { status: 500 });
  }
}

// ✅ DELETE Payroll - No changes needed
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, msg: "Payroll ID is required" }, { status: 400 });
    }

    const deleted = await Payroll.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, msg: "Payroll not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, msg: "Payroll deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, msg: "Error deleting payroll", error }, { status: 500 });
  }
}