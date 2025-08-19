import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { Business } from "@/app/models/business";
import { auth } from "@/app/lib/auth"; // Assuming auth setup is correct

// Helper function for error responses
const errorResponse = (message, status = 400) => {
  return NextResponse.json({ success: false, msg: message }, { status });
};

export async function GET(req) {
  try {
    await connectDB();

    const userData = await auth();
    // Ensure user is authenticated
    if (!userData || !userData.businessName) {
      return errorResponse("Authentication failed or business not found", 401);
    }
    
    const businessName = userData.businessName;

    // Await the query and use .lean() for faster read-only operations
    const business = await Business.findOne({ businessName: businessName }).lean();

    if (!business) {
      return errorResponse(`Business with name "${businessName}" not found`, 404);
    }

    return NextResponse.json({
      success: true,
      msg: "Business Details Fetched Successfully",
      data: business,
    });

  } catch (error) {
    console.error('Error fetching business info:', error);
    return errorResponse('Internal Server Error', 500);
  }
}