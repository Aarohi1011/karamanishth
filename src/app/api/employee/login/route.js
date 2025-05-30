import { NextResponse } from "next/server";
import { CreateSession } from "@/app/lib/sessions";
import connectDB from "@/app/lib/dbconnect";
import { Employee } from "@/app/models/employee";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Business } from "@/app/models/business";

export async function POST(req, res) {
    try {
        await connectDB(); // Ensure Database connection
        const { email, password } = await req.json();
        console.log(email, password);

        const employee = await Employee.findOne({ email });
        console.log(employee);
        const businessName = employee.businessName;
        const businessDetail = await Business.findOne({ businessName: businessName });
        console.log(businessDetail);
        const expiryDate = businessDetail.subscription.expiryDate;
        console.log("Hey I am the expiry date", expiryDate);

        // const business = await Business.findOne({  });

        if (!employee) {
            return NextResponse.json({
                success: false,
                msg: 'user with this email does not exist!'
            }, { status: 400 });
        }
        console.log(employee);
        console.log(password);

        // Direct comparison since password is not encrypted
        if (password !== employee.password) {
            return NextResponse.json({
                success: false,
                msg: 'Incorrect password'
            }, { status: 400 });
        }
        console.log("going to intiaize the token");
        console.log("I am logging ");
        const employeeWithExpiry = {
            ...employee.toObject(),
            expiryDate
        };
        const token = await CreateSession(employeeWithExpiry);
        console.log("Hey I am logging the token", token);

        return NextResponse.json({
            success: true,
            msg: 'Session Created Successfully',
            role: employee.role,
            token: token.headers
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            msg: 'Error occurred',
            error
        }, { status: 500 });
    }
}