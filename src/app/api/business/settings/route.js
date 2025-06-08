import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { BusinessSettings } from "@/app/models/businessSettings";
import { Business } from "@/app/models/business";

// Create or update business settings
export async function POST(req) {
    try {
        await connectDB();
        const { businessId, settingsData } = await req.json();

        // Validate required fields
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

        // Validate working days don't conflict with weekly holidays
        if (settingsData.workingDays && settingsData.weeklyHoliday) {
            const hasConflict = settingsData.workingDays.some(day => 
                settingsData.weeklyHoliday.includes(day)
            );
            if (hasConflict) {
                return NextResponse.json({
                    success: false,
                    msg: 'Working days cannot include weekly holidays'
                }, { status: 400 });
            }
        }

        // Find existing settings or create new ones
        let settings = await BusinessSettings.findOneAndUpdate(
            { business: businessId },
            { $set: settingsData },
            { 
                new: true,
                upsert: true,
                runValidators: true 
            }
        );

        return NextResponse.json({
            success: true,
            msg: 'Business settings saved successfully',
            data: settings
        }, { status: 200 });

    } catch (error) {
        console.error('Error saving business settings:', error);
        return NextResponse.json({
            success: false,
            msg: 'Error saving business settings',
            error: error.message
        }, { status: 500 });
    }
}

// Get business settings
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

        const settings = await BusinessSettings.findOne({ 
            business: businessId 
        }).populate('business', 'businessName businessType');

        if (!settings) {
            // Return default settings structure if none exists
            return NextResponse.json({
                success: true,
                msg: 'No custom settings found, returning defaults',
                data: {
                    business: businessId,
                    defaultInTime: '09:00',
                    defaultOutTime: '18:00',
                    workingDays: [1, 2, 3, 4, 5],
                    weeklyHoliday: [0],
                    lunchStartTime: '13:00',
                    lunchDurationMinutes: 60,
                    gracePeriodMinutes: 15
                }
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            msg: 'Business settings retrieved successfully',
            data: settings
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching business settings:', error);
        return NextResponse.json({
            success: false,
            msg: 'Error fetching business settings',
            error: error.message
        }, { status: 500 });
    }
}

// Delete business settings
export async function DELETE(req) {
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

        const result = await BusinessSettings.deleteOne({ business: businessId });

        if (result.deletedCount === 0) {
            return NextResponse.json({
                success: false,
                msg: 'No settings found to delete'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            msg: 'Business settings deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting business settings:', error);
        return NextResponse.json({
            success: false,
            msg: 'Error deleting business settings',
            error: error.message
        }, { status: 500 });
    }
}