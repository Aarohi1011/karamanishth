import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/dbconnect';
import { Employee } from '@/app/models/employee';

export async function POST(req) {
  await connectDB();
  const { subscription, userId } = await req.json();
    console.log(subscription);
    console.log(userId);
    
    
  const employee = await Employee.findById(userId);
  if (!employee) return NextResponse.json({ success: false, message: 'User not found' });

  employee.subscription = subscription;
  await employee.save();

  return NextResponse.json({ success: true });
}
