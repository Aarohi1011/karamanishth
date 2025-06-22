import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/dbconnect';
import { DailyAttendance } from '@/app/models/dailyAttendance';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const businessId = searchParams.get('businessId');

    if (!employeeId || !businessId) {
      return NextResponse.json({
        success: false,
        msg: 'Employee ID and Business ID are required'
      }, { status: 400 });
    }

    const now = new Date();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffsetMs);
    const currentYear = istNow.getUTCFullYear();
    const currentMonth = istNow.getUTCMonth();

    // Helper to get first and last day of a given month
    const getMonthRange = (year, month) => {
      const firstDay = new Date(Date.UTC(year, month, 1));
      const lastDay = new Date(Date.UTC(year, month + 1, 0));
      return { firstDay, lastDay };
    };

    // Get current and past 3 months
    const monthsToFetch = [0, 1, 2, 3].map(offset => {
      const date = new Date(currentYear, currentMonth - offset);
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
      };
    });

    const summaries = [];
    let currentMonthSummary = null;

    for (const { year, month, label } of monthsToFetch) {
      const { firstDay, lastDay } = getMonthRange(year, month);

      const records = await DailyAttendance.find({
        date: { $gte: firstDay, $lte: lastDay },
        business: businessId,
        'employees.employee': employeeId
      });

      let totalPresent = 0;
      let totalAbsent = 0;
      let totalLate = 0;
      let totalWorkHours = 0;
      const recordsList = [];

      for (const record of records) {
        const emp = record.employees.find(e => e.employee.toString() === employeeId);
        if (!emp) continue;

        if (['Present', 'Half-Day', 'Late'].includes(emp.status)) {
          totalPresent++;
          totalWorkHours += emp.workHours || 0;
        }
        if (emp.status === 'Absent') totalAbsent++;
        if (emp.status === 'Late') totalLate++;

        recordsList.push({
          date: record.date,
          inTime: emp.inTime,
          outTime: emp.outTime,
          status: emp.status,
          workHours: emp.workHours,
          notes: emp.notes,
          deviceInfo: emp.deviceInfo
        });
      }

      const summary = {
        label,
        totalPresent,
        totalAbsent,
        totalLate,
        averageWorkHours: totalPresent > 0 ? parseFloat((totalWorkHours / totalPresent).toFixed(2)) : 0,
        records: recordsList
      };

      if (month === currentMonth && year === currentYear) {
        currentMonthSummary = summary;
      } else {
        summaries.push(summary);
      }
    }

    return NextResponse.json({
      success: true,
      msg: 'Attendance summary retrieved successfully',
      data: {
        monthly: currentMonthSummary,
        pastMonths: summaries
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    return NextResponse.json({
      success: false,
      msg: 'Error fetching attendance summary',
      error: error.message
    }, { status: 500 });
  }
}
