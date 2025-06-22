export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get('businessId');

        if (!businessId) {
            return NextResponse.json({
                success: false,
                msg: 'Business ID is required'
            }, { status: 400 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if today is a holiday
        const isHoliday = await Holiday.findOne({
            business: businessId,
            date: today
        });

        if (isHoliday) {
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
        const dayOfWeek = today.getDay();
        const isWeeklyHoliday = await Holiday.findOne({
            business: businessId,
            isWeeklyHoliday: true,
            $or: [
                { recurrencePattern: 'weekly' },
                {
                    recurrencePattern: 'yearly',
                    date: {
                        $expr: {
                            $and: [
                                { $eq: [{ $month: "$date" }, today.getMonth() + 1] },
                                { $eq: [{ $dayOfMonth: "$date" }, today.getDate()] }
                            ]
                        }
                    }
                }
            ]
        });

        if (isWeeklyHoliday) {
            return NextResponse.json({
                success: true,
                msg: `Today is a weekly holiday (${isWeeklyHoliday.name})`,
                isHoliday: true,
                holidayName: isWeeklyHoliday.name,
                holidayDescription: isWeeklyHoliday.description,
                data: null
            }, { status: 200 });
        }

        const attendanceRecord = await DailyAttendance.findOne({
            date: today,
            business: businessId
        }).populate('employees.employee', 'name role');

        if (!attendanceRecord) {
            return NextResponse.json({
                success: true,
                msg: 'No attendance recorded today',
                data: null
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            msg: 'Attendance retrieved successfully',
            data: attendanceRecord
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching attendance:', error);
        return NextResponse.json({
            success: false,
            msg: 'Error fetching attendance',
            error: error.message
        }, { status: 500 });
    }
}