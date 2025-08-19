import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { Employee } from "@/app/models/employee";

// Helper function for error responses
const errorResponse = (message, status = 400) => {
  return NextResponse.json({ success: false, msg: message }, { status });
};

// -------------------- GET --------------------
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const role = searchParams.get("role");
    const active = searchParams.get("active");

    // If ID is provided, fetch employee by ID directly
    if (id) {
      const employee = await Employee.findById(id);
      if (!employee) {
        return errorResponse("Employee not found", 404);
      }
      return NextResponse.json({ success: true, data: employee });
    }

    // Otherwise, build a dynamic query
    const query = {};
    if (role) query.role = role;
    if (active) query.active = active === "true";

    const employees = await Employee.find(query).sort({ joinDate: -1 });

    return NextResponse.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return errorResponse("Failed to fetch employees", 500);
  }
}

// -------------------- PATCH (Update) --------------------
export async function PATCH(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { _id, ...updates } = body;

    if (!_id) {
      return errorResponse("Employee ID is required", 400);
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(_id, updates, {
      new: true, // return updated document
      runValidators: true, // validate schema
    });

    if (!updatedEmployee) {
      return errorResponse("Employee not found", 404);
    }

    return NextResponse.json({
      success: true,
      msg: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return errorResponse("Failed to update employee", 500);
  }
}

// -------------------- DELETE --------------------
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Employee ID is required", 400);
    }

    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return errorResponse("Employee not found", 404);
    }

    return NextResponse.json({
      success: true,
      msg: "Employee deleted successfully",
      data: deletedEmployee,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return errorResponse("Failed to delete employee", 500);
  }
}
