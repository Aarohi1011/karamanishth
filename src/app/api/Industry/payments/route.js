// app/api/transactions/submit/route.js
import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { Transaction } from "@/app/models/pricingmodel";

export async function GET(req) {
    try {
      await connectDB();
      
      const transactions = await Transaction.find({ 
      }).sort({ createdAt: -1 });
  
      return NextResponse.json({
        success: true,
        data: transactions
      }, { status: 200 });
  
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json({
        success: false,
        msg: 'Error fetching transactions',
        error: error.message
      }, { status: 500 });
    }
  } 