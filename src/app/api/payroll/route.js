import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import Payroll from "@/app/models/payroll";
import { Employee } from "@/app/models/employee";
import { Business } from "@/app/models/business";
import { DailyAttendance } from "@/app/models/dailyAttendance";
import { BusinessSettings } from "@/app/models/businessSettings";
import { auth } from "@/app/lib/auth";

// ✅ CREATE Payroll (POST) - No changes from your provided code
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
    console.error("Error in POST /api/payroll:", error);
    return NextResponse.json({ success: false, msg: "Error creating payroll", error: error.message }, { status: 500 });
  }
}

// ✅ GET Payrolls and Generate Attendance Data (GET) - UPDATED LOGIC
export async function GET(req) {
  try {
    await connectDB();
    const user = await auth();

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const employeeId = searchParams.get("employeeId"); // Can be used to fetch for a single employee
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!businessId || !month || !year) {
      return NextResponse.json(
        { success: false, msg: "businessId, month, and year are required" },
        { status: 400 }
      );
    }

    // --- Date and Business Settings Calculation ---
    const yearNum = parseInt(year);
    const monthNum = parseInt(month) - 1;
    const startDate = new Date(Date.UTC(yearNum, monthNum, 1));
    const endDate = new Date(Date.UTC(yearNum, monthNum + 1, 0, 23, 59, 59, 999));
    const totalWorkingDays = new Date(yearNum, monthNum + 1, 0).getDate();

    let standardWorkHoursPerDay = 8; // Default fallback
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
        } catch (e) {
            console.warn("Could not parse business work hours, using default.", e);
        }
    }
    const totalMonthWorkHours = parseFloat((totalWorkingDays * standardWorkHoursPerDay).toFixed(2));

    // --- Fetch Existing and New Employee Data ---
    let filter = { businessId, month, year };
    if (employeeId) filter.employee = employeeId;

    // 1. Fetch payrolls that already exist in the database
    const existingPayrolls = await Payroll.find(filter)
      .populate("employee", "name email phone role salary")
      .lean();

    const employeesWithPayroll = new Set(existingPayrolls.map(p => p.employee._id.toString()));

    // 2. Fetch all active staff employees who DO NOT have a payroll record yet
    let newEmployeeFilter = { 
        businessName: user.businessName, 
        role: "Staff", 
        active: true,
        _id: { $nin: Array.from(employeesWithPayroll) }
    };
    // If a specific employee is requested, we only care about that one
    if (employeeId) {
        newEmployeeFilter = { _id: employeeId, _id: { $nin: Array.from(employeesWithPayroll) } };
    }
    
    const employeesToProcess = await Employee.find(newEmployeeFilter).lean();

    let generatedData = [];

    if (employeesToProcess.length > 0) {
        // 3. Generate attendance data for the employees found in the previous step
        const monthlyAttendance = await DailyAttendance.find({
            business: businessId,
            date: { $gte: startDate, $lte: endDate },
            'employees.employee': { $in: employeesToProcess.map(e => e._id) }
        });

        const employeeStats = new Map();
        employeesToProcess.forEach(emp => {
            employeeStats.set(emp._id.toString(), {
                presentDays: 0,
                halfDays: 0, // Explicitly track half days
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
                        if (attendanceEntry.inStatus === 'Half-Day') {
                            stats.presentDays += 0.5;
                            stats.halfDays += 1;
                        } else {
                            stats.presentDays += 1;
                        }
                    }
                    stats.employeeTotalHours += attendanceEntry.workHours || 0;
                }
            });
        });
        
        generatedData = Array.from(employeeStats.values()).map(stat => ({
            ...stat,
            employeeTotalHours: parseFloat(stat.employeeTotalHours.toFixed(2)),
        }));
    }

    // 4. Combine existing and generated data, adding total month hours to all
    const combinedPayrolls = [
        ...existingPayrolls.map(p => ({ ...p, totalWorkingHours: totalMonthWorkHours })),
        ...generatedData.map(g => ({ ...g, totalWorkingHours: totalMonthWorkHours }))
    ];

    return NextResponse.json(
      { success: true, count: combinedPayrolls.length, payrolls: combinedPayrolls },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in GET /api/payroll:", error);
    return NextResponse.json(
      { success: false, msg: "An error occurred while fetching payroll data", error: error.message },
      { status: 500 }
    );
  }
}


// ✅ UPDATE Payroll (PUT) - No changes from your provided code
export async function PUT(req) {
  try {
    await connectDB();
    const { id, updates } = await req.json();

    if (!id || !updates) {
        return NextResponse.json({ success: false, msg: "Payroll ID and updates are required" }, { status: 400 });
    }

    const payroll = await Payroll.findByIdAndUpdate(id, updates, { new: true });
    if (!payroll) {
      return NextResponse.json({ success: false, msg: "Payroll not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, msg: "Payroll updated", payroll }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/payroll:", error);
    return NextResponse.json({ success: false, msg: "Error updating payroll", error: error.message }, { status: 500 });
  }
}

// ✅ DELETE Payroll - No changes from your provided code
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
    console.error("Error in DELETE /api/payroll:", error);
    return NextResponse.json({ success: false, msg: "Error deleting payroll", error: error.message }, { status: 500 });
  }
}
