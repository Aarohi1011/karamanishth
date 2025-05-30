// app/api/business/setup/route.js
import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { Business } from "@/app/models/business";
import { Employee } from "@/app/models/employee";
export async function POST(req) {
  try {
    await connectDB(); // Ensure Database connection

    const {
      businessName,
      businessType,
      address,
      city,
      state,
      postalCode,
      country,
      contactName,
      phone,
      email,
      employees,
      role
    } = await req.json();

    // Validate required fields
    if (!businessName || !businessType || !address || !city || !state || !postalCode || !country || !contactName || !phone || !email) {
      return NextResponse.json({
        success: false,
        msg: 'All required fields must be filled'
      }, { status: 400 });
    }
    console.log(businessName, businessType,
      address,
      city,
      state,
      postalCode,
      country,
      contactName,
      phone,
      email,
      employees,
      role);

    // Check if business with this email already exists
    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return NextResponse.json({
        success: false,
        msg: 'A business with this email already exists'
      }, { status: 400 });
    }

    // Create new business record
    const newBusiness = new Business({
      businessName,
      businessType,
      address,
      city,
      state,
      postalCode,
      country,
      phone,
      email,
    });

    const savedBusiness = await newBusiness.save();
    // Create & save employees
    // First create employee record for the primary contact
    try {
      const primaryContactEmployee = new Employee({
        name: contactName,
        phone,
        email,
        businessName: savedBusiness.businessName,
        role,
        joinDate: new Date()
      });
      await primaryContactEmployee.save();
    } catch (primaryContactError) {
      console.error('Error creating primary contact employee:', primaryContactError);
      // Continue even if primary contact employee creation fails
    }
    // Process employees - first check for duplicates
    const validEmployees = employees.filter(emp => emp.name && emp.phone);
    
    if (validEmployees.length > 0) {
      // Check for existing employees with same phone or email
      const existingEmployees = await Employee.find({
        $or: [
          { phone: { $in: validEmployees.map(e => e.phone) } },
          { email: { $in: validEmployees.filter(e => e.email).map(e => e.email) } }
        ]
      });

      if (existingEmployees.length > 0) {
        const conflicts = existingEmployees.map(emp => 
          emp.phone ? `Phone: ${emp.phone}` : `Email: ${emp.email}`
        );
        return NextResponse.json({
          success: false,
          msg: 'Some employees already exist in the system',
          conflicts
        }, { status: 400 });
      }

      // Prepare employee documents with all possible fields
      const employeeDocs = validEmployees.map(emp => ({
        name: emp.name,
        phone: emp.phone,
        email: emp.email || '',
        address: emp.address || '',
        businessName: savedBusiness.businessName,
        role: emp.role || 'Staff',
        experience: emp.experience || '',
        bio: emp.bio || '',
        skills: emp.skills || [],
        salary: emp.salary || '',
        permissions: emp.permissions || [],
        active: true,
        joinDate: emp.joinDate || new Date()
      }));

      // Use insertMany with error handling
      try {
        await Employee.insertMany(employeeDocs, { ordered: false });
      } catch (bulkError) {
        // Even if some fail, others will be inserted
        console.warn('Partial employee insertion:', bulkError);
      }
    }


    // Create session for the new business (if you have authentication)
    // const token = CreateSession(savedBusiness);
    // cookies().set('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 24 * 7, // One week
    //   path: '/',
    // });

    return NextResponse.json({
      success: true,
      msg: 'Business setup completed successfully',
      business: {
        id: savedBusiness._id,
        name: savedBusiness.businessName,
        email: savedBusiness.email
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Business setup error:', error);
    return NextResponse.json({
      success: false,
      msg: 'Error occurred during business setup',
      error: error.message
    }, { status: 500 });
  }
}