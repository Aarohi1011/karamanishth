import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import Payroll from "@/app/models/payroll";
import { Employee } from "@/app/models/employee";
import { Business } from "@/app/models/business";
import { DailyAttendance } from "@/app/models/dailyAttendance";
import { BusinessSettings } from "@/app/models/businessSettings"; // Import the new settings model
import { auth } from "@/app/lib/auth";

// ✅ CREATE Payroll (POST) - No changes
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const employee = await Employee.findById(data.employee);
    if (!employee) {
      return NextResponse.json({ success: false, msg: "Employee not found" }, { status: 404 });
    }

    const business = await Business.findById(data.businessId);
    if (!business) {
      return NextResponse.json({ success: false, msg: "Business not found" }, { status: 404 });
    }

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

// ✅ GET Payrolls or Generate Attendance Data (GET) - UPDATED LOGIC
export async function GET(req) {
  try {
    console.log("\x1b[34m📡 [REQUEST] Incoming GET /api/payrolls\x1b[0m");
    await connectDB();
    const user = await auth();
    console.log("\x1b[32m✅ [DB] Connected successfully\x1b[0m");

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const employeeId = searchParams.get("employeeId");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!businessId || !month || !year) {
      return NextResponse.json(
        { success: false, msg: "businessId, month, and year are required" },
        { status: 400 }
      );
    }

    let filter = { businessId, month, year };
    if (employeeId) filter.employee = employeeId;

    const existingPayrolls = await Payroll.find(filter)
      .populate("employee", "name email phone role salary")
      .populate("businessId", "businessName businessType");

    if (existingPayrolls.length > 0) {
      console.log(`\x1b[32m✅ [FOUND] Found ${existingPayrolls.length} existing payroll document(s).\x1b[0m`);
      return NextResponse.json(
        { success: true, count: existingPayrolls.length, payrolls: existingPayrolls, dataType: 'existing' },
        { status: 200 }
      );
    }

    console.log("\x1b[33m⚠️ [ACTION] No payrolls found → Calculating attendance data.\x1b[0m");

    const yearNum = parseInt(year);
    const monthNum = parseInt(month) - 1;
    const startDate = new Date(Date.UTC(yearNum, monthNum, 1));
    const endDate = new Date(Date.UTC(yearNum, monthNum + 1, 0, 23, 59, 59, 999));
    const totalWorkingDays = new Date(yearNum, monthNum + 1, 0).getDate();

    let employeeFilter = { businessName: user.businessName, role: "Staff", active: true };
    if (employeeId) {
        employeeFilter = { _id: employeeId };
    }
    const employees = await Employee.find(employeeFilter).lean();

    if (employees.length === 0) {
        return NextResponse.json(
            { success: true, count: 0, payrolls: [], msg: "No staff employees found to calculate attendance." },
            { status: 200 }
        );
    }
    
    const monthlyAttendance = await DailyAttendance.find({
      business: businessId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Dynamically calculate standard work hours from business settings
    let standardWorkHoursPerDay = 8; // Default fallback value
    const settings = await BusinessSettings.findOne({ business: businessId }).lean();
    
    if (settings) {
        try {
            const [inHour, inMinute] = settings.defaultInTime.split(':').map(Number);
            const [outHour, outMinute] = settings.defaultOutTime.split(':').map(Number);
            const grossWorkMinutes = (outHour * 60 + outMinute) - (inHour * 60 + inMinute);
            const lunchMinutes = settings.lunchDurationMinutes || 0;
            const netWorkMinutes = grossWorkMinutes - lunchMinutes;

            if (netWorkMinutes > 0) {
                standardWorkHoursPerDay = netWorkMinutes / 60;
            }
            console.log(`\x1b[36m⚙️ [SETTINGS] Standard work hours per day: ${standardWorkHoursPerDay.toFixed(2)}\x1b[0m`);
        } catch (e) {
            console.warn("\x1b[31m⚠️ [SETTINGS] Failed to parse work hours from settings, using default 8 hours.\x1b[0m", e);
        }
    } else {
        console.warn("\x1b[33m⚠️ [SETTINGS] No business settings found, using default 8 work hours per day.\x1b[0m");
    }

    const employeeStats = new Map();
    employees.forEach(emp => {
      employeeStats.set(emp._id.toString(), {
        presentDays: 0,
        employeeTotalHours: 0,
        employee: emp,
        totalWorkingDays,
        basicSalary: Number(emp.salary) || 0,
        month,
        year,
        businessId,
        paymentStatus: "pending_generation",
      });
    });
    
    monthlyAttendance.forEach(dailyRecord => {
        dailyRecord.employees.forEach(attendanceEntry => {
            const empId = attendanceEntry.employee.toString();
            if (employeeStats.has(empId)) {
                const stats = employeeStats.get(empId);
                if (attendanceEntry.inStatus && attendanceEntry.inStatus !== 'Absent' && attendanceEntry.inStatus !== 'Leave') {
                    stats.presentDays += (attendanceEntry.inStatus === 'Half-Day' ? 0.5 : 1);
                }
                stats.employeeTotalHours += attendanceEntry.workHours || 0;
            }
        });
    });
    
    const generatedData = Array.from(employeeStats.values()).map(stat => {
        const expectedHours = stat.presentDays * standardWorkHoursPerDay;
        
        return {
            ...stat,
            employeeTotalHours: parseFloat(stat.employeeTotalHours.toFixed(2)),
            totalWorkingHours: parseFloat(expectedHours.toFixed(2))
        };
    });
    
    console.log(`\x1b[32m✅ [SUCCESS] Generated attendance data for ${generatedData.length} employee(s).\x1b[0m`);
    
    return NextResponse.json(
      { success: true, count: generatedData.length, payrolls: generatedData, dataType: 'generated' },
      { status: 200 }
    );

  } catch (error) {
    console.error("\x1b[31m🔥 [EXCEPTION] Error fetching payrolls\x1b[0m", error);
    return NextResponse.json(
      { success: false, msg: "An error occurred while fetching payroll data", error: error.message },
      { status: 500 }
    );
  }
}


// ✅ UPDATE Payroll (PUT) - No changes
export async function PUT(req) {
  try {
    await connectDB();
    const { id, updates } = await req.json();

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

// ✅ DELETE Payroll - No changes
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