import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { Employee } from "@/app/models/employee";

// Helper function for error responses
const errorResponse = (message, status = 400) => {
  return NextResponse.json({ success: false, msg: message }, { status });
};

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const active = searchParams.get('active');
    
    // Build query object
    const query = {};
    if (role) query.role = role;
    if (active) query.active = active === 'true';
    
    const employees = await Employee.find(query).sort({ joinDate: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: employees 
    });
    
  } catch (error) {
    console.error('Error fetching employees:', error);
    return errorResponse('Failed to fetch employees', 500);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    
    const {
      name,
      email,
      phone,
      address,
      businessName,
      role,
      experience,
      bio,
      skills,
      salary,
      permissions
    } = await req.json();

    // Validate required fields
    if (!name || !phone) {
      return errorResponse('Name and phone are required fields');
    }

    // Check for existing employee with same email or phone
    const existingEmployee = await Employee.findOne({ 
      $or: [
        { email: email || '' }, 
        { phone }
      ] 
    });
    
    if (existingEmployee) {
      return errorResponse('Employee with this email or phone already exists');
    }

    // Create new employee
    const newEmployee = new Employee({
      name,
      email,
      phone,
      address,
      businessName,
      role,
      experience,
      bio,
      skills: typeof skills === 'string' ? 
        skills.split(',').map(s => s.trim()) : 
        skills || [],
      salary,
      permissions: permissions || [],
      active: true
    });

    const savedEmployee = await newEmployee.save();

    return NextResponse.json({
      success: true,
      msg: 'Employee created successfully',
      data: savedEmployee
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating employee:', error);
    return errorResponse('Failed to create employee', 500);
  }
}