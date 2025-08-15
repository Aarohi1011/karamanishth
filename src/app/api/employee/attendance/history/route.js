import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/dbconnect';
import { DailyAttendance } from '@/app/models/dailyAttendance';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const businessId = searchParams.get('businessId');
    const monthParam = searchParams.get('month'); // format: YYYY-MM

    if (!employeeId || !businessId) {
      return NextResponse.json({
        success: false,
        msg: 'Employee ID and Business ID are required'
      }, { status: 400 });
    }

    let year, month;
    if (monthParam) {
      // Parse the passed month (e.g., "2025-07")
      const [paramYear, paramMonth] = monthParam.split('-').map(Number);
      if (!paramYear || !paramMonth || paramMonth < 1 || paramMonth > 12) {
        return NextResponse.json({
          success: false,
          msg: 'Invalid month parameter. Use format YYYY-MM'
        }, { status: 400 });
      }
      year = paramYear;
      month = paramMonth - 1; // JS months are 0-indexed
    } else {
      // Default: current month in IST
      const now = new Date();
      const istOffsetMs = 5.5 * 60 * 60 * 1000;
      const istNow = new Date(now.getTime() + istOffsetMs);
      year = istNow.getUTCFullYear();
      month = istNow.getUTCMonth();
    }

    // First and last day of the target month
    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

    // Fetch attendance records for the given month
    const records = await DailyAttendance.find({
      date: { $gte: firstDay, $lte: lastDay },
      business: businessId,
      'employees.employee': employeeId
    }).sort({ date: 1 });

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalEarlyLeave = 0;
    let totalWorkHours = 0;
    const recordsList = [];

    for (const record of records) {
      const emp = record.employees.find(e => e.employee.toString() === employeeId);
      if (!emp) continue;

      const isPresent = emp.inStatus !== 'Absent' && emp.outStatus !== 'Absent';
      const isLate = emp.inStatus === 'Late';
      const isEarlyLeave = emp.outStatus === 'Early Leave';

      if (isPresent) {
        totalPresent++;
        totalWorkHours += emp.workHours || 0;
      } else {
        totalAbsent++;
      }

      if (isLate) totalLate++;
      if (isEarlyLeave) totalEarlyLeave++;

      recordsList.push({
        date: record.date,
        inTime: emp.inTime,
        outTime: emp.outTime,
        inStatus: emp.inStatus,
        outStatus: emp.outStatus,
        workHours: emp.workHours,
        notes: emp.notes,
        deviceInfo: emp.deviceInfo
      });
    }

    return NextResponse.json({
      success: true,
      msg: 'Monthly attendance retrieved successfully',
      data: {
        monthLabel: `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`,
        totalDays: recordsList.length,
        totalPresent,
        totalAbsent,
        totalLate,
        totalEarlyLeave,
        averageWorkHours: totalPresent > 0 ? parseFloat((totalWorkHours / totalPresent).toFixed(2)) : 0,
        records: recordsList
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching monthly attendance:', error);
    return NextResponse.json({
      success: false,
      msg: 'Error fetching monthly attendance',
      error: error.message
    }, { status: 500 });
  }
}
