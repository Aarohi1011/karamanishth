import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { Holiday } from "@/app/models/holiday";
import { Business } from "@/app/models/business";
import { BusinessSettings } from "@/app/models/businessSettings";

// Create a new holiday
export async function POST(req) {
    try {
        await connectDB();
        const { businessId, date, name, description, recurring, recurrencePattern, isCustomHoliday } = await req.json();

        // Validate required fields
        if (!businessId || !date || !name) {
            return NextResponse.json({
                success: false,
                msg: 'Business ID, date, and name are required'
            }, { status: 400 });
        }

        // Check if business exists
        const business = await Business.findById(businessId);
        if (!business) {
            return NextResponse.json({
                success: false,
                msg: 'Business not found'
            }, { status: 404 });
        }

        // Create holiday
        const holiday = new Holiday({
            business: businessId,
            date: new Date(date),
            name,
            description,
            recurring,
            recurrencePattern,
            isCustomHoliday: isCustomHoliday || false
        });

        await holiday.save();

        return NextResponse.json({
            success: true,
            msg: 'Holiday created successfully',
            data: holiday
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating holiday:', error);
        return NextResponse.json({
            success: false,
            msg: 'Error creating holiday',
            error: error.message
        }, { status: 500 });
    }
}

// Get holidays for a business (optionally filtered by month/year)
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get('businessId');
        const month = searchParams.get('month'); // 0-11
        const year = searchParams.get('year');

        if (!businessId) {
            return NextResponse.json({
                success: false,
                msg: 'Business ID is required'
            }, { status: 400 });
        }

        // Check if business exists
        const business = await Business.findById(businessId);
        if (!business) {
            return NextResponse.json({
                success: false,
                msg: 'Business not found'
            }, { status: 404 });
        }

        // Base query
        let query = { business: businessId };

        // Add month/year filter if provided
        if (year && month !== null) {
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, Number(month) + 1, 0);
            query.date = { $gte: startDate, $lte: endDate };
        } else if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            query.date = { $gte: startDate, $lte: endDate };
        }

        // Get holidays from database
        const holidays = await Holiday.find(query).sort({ date: 1 });

        // Get weekly holidays from business settings
        const settings = await BusinessSettings.findOne({ business: businessId });
        let weeklyHolidays = [];
        
        if (settings && settings.weeklyHoliday && settings.weeklyHoliday.length > 0) {
            weeklyHolidays = generateWeeklyHolidays(settings.weeklyHoliday, year, month);
        }

        return NextResponse.json({
            success: true,
            msg: 'Holidays retrieved successfully',
            data: {
                customHolidays: holidays,
                weeklyHolidays,
                settings: {
                    weeklyHoliday: settings?.weeklyHoliday || [0] // Default to Sunday if no settings
                }
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching holidays:', error);
        return NextResponse.json({
            success: false,
            msg: 'Error fetching holidays',
            error: error.message
        }, { status: 500 });
    }
}
// Helper function to generate weekly holidays for a given month/year
function generateWeeklyHolidays(weeklyHolidayDays, year, month) {
    if (!weeklyHolidayDays || weeklyHolidayDays.length === 0) return [];
    
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month !== null ? parseInt(month) : new Date().getMonth();
    
    // Create dates in UTC to avoid timezone issues
    const startDate = new Date(Date.UTC(targetYear, targetMonth, 1));
    const endDate = new Date(Date.UTC(targetYear, targetMonth + 1, 0));
    
    const holidays = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        // Use getUTCDay() instead of getDay() to avoid timezone effects
        if (weeklyHolidayDays.includes(currentDate.getUTCDay())) {
            // Create date in UTC without time component
            const holidayDate = new Date(Date.UTC(
                currentDate.getUTCFullYear(),
                currentDate.getUTCMonth(),
                currentDate.getUTCDate()
            ));
            
            holidays.push({
                date: holidayDate,
                name: 'Weekly Holiday',
                description: 'Regular weekly holiday',
                isWeeklyHoliday: true,
                dayOfWeek: currentDate.getUTCDay() // This should now correctly show 0 for Sunday
            });
        }
        // Move to next day in UTC
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    
    return holidays;
}

// Delete a holiday
export async function DELETE(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const holidayId = searchParams.get('holidayId');

        if (!holidayId) {
            return NextResponse.json({
                success: false,
                msg: 'Holiday ID is required'
            }, { status: 400 });
        }

        const result = await Holiday.findByIdAndDelete(holidayId);

        if (!result) {
            return NextResponse.json({
                success: false,
                msg: 'Holiday not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            msg: 'Holiday deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting holiday:', error);
        return NextResponse.json({
            success: false,
            msg: 'Error deleting holiday',
            error: error.message
        }, { status: 500 });
    }
}