'use server'

import { NextResponse } from "next/server";
import { EndSession } from "@/app/lib/sessions";
import { cookies } from "next/headers";

export async function POST(req, res) {
    try {
        // End the session by calling the EndSession function
        const response = await EndSession();

        // Return a response indicating the session has been deleted
        return NextResponse.json({
            success: true,
            msg: 'Logged out successfully',
        }, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            msg: 'Error occurred during logout',
            error
        }, { status: 500 });
    }
}