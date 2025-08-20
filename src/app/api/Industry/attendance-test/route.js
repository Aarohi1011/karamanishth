import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { DailyAttendance } from "@/app/models/dailyAttendance";
import { Holiday } from "@/app/models/holiday";
import { Employee } from "@/app/models/employee";
import connectDB from "@/app/lib/dbconnect";
import { auth } from "@/app/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const user = await auth(); // ✅ get logged in user
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(user);
    
    const businessName = user.businessName; // 🔹 Assuming user has business field
    console.log(businessName);
    
    if (!businessName) {
      return NextResponse.json({ error: "No businessName assigned" }, { status: 400 });
    }

    const employees = await Employee.find({ businessName: businessName })
    console.log(employees);
    

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    console.error("Employees API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees", details: error.message },
      { status: 500 }
    );
  }
}


function normalizeDate(date) {
  const d = new Date(date);

  // create new date at local midnight
  const normalized = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  // force UTC midnight (no shifting the date)
  return new Date(Date.UTC(
    normalized.getFullYear(),
    normalized.getMonth(),
    normalized.getDate()
  ));
}

export async function POST(req) {
  try {
    await connectDB();
    const { employeeId, date, type, time, deviceInfo, notes } =
      await req.json();
      console.log( employeeId, date, type, time, deviceInfo, notes );
    const user = await auth();
    const businessId = user.businessId
    if (!employeeId || !businessId || !date || !type || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const attendanceDate = normalizeDate(date);

    // ✅ Check if holiday
    const holiday = await Holiday.findOne({
      business: businessId,
      date: attendanceDate,
    });

    if (holiday) {
      return NextResponse.json(
        {
          error: "Attendance cannot be marked on a holiday",
          holiday: holiday.name,
        },
        { status: 400 }
      );
    }

    // ✅ Ensure employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // ✅ Find or create DailyAttendance
    let daily = await DailyAttendance.findOne({
      business: businessId,
      date: attendanceDate,
    });

    if (!daily) {
      daily = new DailyAttendance({
        business: businessId,
        date: attendanceDate,
        employees: [],
      });
    }

    // ✅ Find employee entry
    let empAttendance = daily.employees.find(
      (emp) => emp.employee.toString() === employeeId
    );

    if (!empAttendance) {
      empAttendance = {
        employee: employeeId,
        inStatus: "Absent",
        outStatus: "Absent",
        workHours: 0,
        deviceInfo,
        notes,
      };
      daily.employees.push(empAttendance);
    }

    // ✅ Mark IN / OUT
    let actionLog = "";
    if (type === "in") {
      empAttendance.inTime = new Date(time);
      empAttendance.inStatus =
        new Date(time).getHours() <= 9 ? "On Time" : "Late";
      actionLog = `🟢 IN marked at ${new Date(time).toLocaleTimeString()} (${empAttendance.inStatus})`;
    } else if (type === "out") {
      empAttendance.outTime = new Date(time);
      empAttendance.outStatus =
        new Date(time).getHours() >= 17 ? "On Time" : "Early Leave";
      actionLog = `🔴 OUT marked at ${new Date(time).toLocaleTimeString()} (${empAttendance.outStatus})`;
    }

    empAttendance.deviceInfo = deviceInfo || empAttendance.deviceInfo;
    empAttendance.notes = notes || empAttendance.notes;

    await daily.save();

    // ✅ Build a rich log object
    const log = {
      employee: employee.name,
      employeeId: employee._id,
      date: attendanceDate.toDateString(),
      action: type.toUpperCase(),
      time: new Date(time).toLocaleTimeString(),
      status: type === "in" ? empAttendance.inStatus : empAttendance.outStatus,
      notes: empAttendance.notes,
      deviceInfo: empAttendance.deviceInfo,
      message: actionLog,
    };

    return NextResponse.json(
      { message: "Attendance marked successfully", log, daily },
      { status: 200 }
    );
  } catch (error) {
    console.error("Attendance Error:", error);
    return NextResponse.json(
      { error: "Failed to mark attendance", details: error.message },
      { status: 500 }
    );
  }
}

