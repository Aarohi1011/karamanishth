import { NextResponse } from "next/server";
import { CreateSession } from "@/app/lib/sessions";
import connectDB from "@/app/lib/dbconnect";
import { Employee } from "@/app/models/employee";
import { Business } from "@/app/models/business";

export async function POST(req) {
  console.group("%c🟢 Login API Request", "color:#16a34a;font-weight:bold;");
  const startTime = Date.now();

  try {
    await connectDB();
    console.info("✅ Database connected");

    const { email, password } = await req.json();
    console.log("📧 Email received:", email);

    const employee = await Employee.findOne({ email: email });
    if (!employee) {
      console.warn("❌ No user found with email:", email);
      console.groupEnd();
      return NextResponse.json(
        { success: false, msg: "User with this email does not exist!" },
        { status: 400 }
      );
    }

    console.log("👤 Employee found:", {
      id: employee._id,
      role: employee.role,
      businessName: employee.businessName,
    });

    // Password check (direct comparison since it's not hashed)
    if (password !== employee.password) {
      console.warn("❌ Incorrect password for:", email);
      console.groupEnd();
      return NextResponse.json(
        { success: false, msg: "Incorrect password" },
        { status: 400 }
      );
    }

    const businessDetail = await Business.findOne({
      businessName: employee.businessName,
    });
    console.log("🏢 Business found:", businessDetail?.businessName);

    const expiryDate = businessDetail?.subscription?.expiryDate;
    console.log("📅 Subscription Expiry:", expiryDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Block Staff login if subscription expired
    if (employee.role === "Staff" && expiryDate && expiryDate < today) {
      console.warn("🚫 Subscription expired for business:", employee.businessName);
      console.groupEnd();
      return NextResponse.json(
        {
          success: false,
          msg: "Subscription has expired. Please renew to continue access.",
        },
        { status: 403 }
      );
    }

    console.log("🔑 Creating session token...");
    const employeeWithExpiry = {
      ...employee.toObject(),
      expiryDate,
      businessId: businessDetail?._id,
    };

    const token = await CreateSession(employeeWithExpiry);
    console.log("✅ Session created, token generated");

    const endTime = Date.now();
    console.info(`⏱️ Execution time: ${endTime - startTime} ms`);
    console.groupEnd();

    return NextResponse.json(
      {
        success: true,
        msg: "Session Created Successfully",
        role: employee.role,
        token: token.headers, // ⚠️ double-check this, might need token itself
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error in Login API:", error.message);
    console.groupEnd();
    return NextResponse.json(
      { success: false, msg: "Error occurred", error: error.message },
      { status: 500 }
    );
  }
}
