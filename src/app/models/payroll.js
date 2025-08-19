import mongoose from "mongoose";

const PayrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },

  // Payroll Period
  month: { type: Number, required: true },  // 1-12
  year: { type: Number, required: true },

  // ✅ UPDATED SECTION: Attendance & Work Hour Data
  totalWorkingDays: { type: Number, default: 0 },
  presentDays: { type: Number, default: 0 },
  absentDays: { type: Number, default: 0 },
  leaveDays: { type: Number, default: 0 },
  halfDays: { type: Number, default: 0 },
  totalWorkHours: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  holidayWorkDays: { type: Number, default: 0 },
  holidayWorkHours: { type: Number, default: 0 },
  totalBusinessHours: { type: Number, default: 0 },

  // Salary Structure
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  overtimePay: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },

  // Deductions
  tax: { type: Number, default: 0 },
  providentFund: { type: Number, default: 0 },
  professionalTax: { type: Number, default: 0 },
  otherDeductions: { type: Number, default: 0 },

  // Final Salary
  grossSalary: { type: Number, required: true },
  totalDeductions: { type: Number, required: true },
  netSalary: { type: Number, required: true },

  // Payment Info
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  paymentDate: { type: Date },
  paymentMode: { type: String, enum: ["Cash", "Bank Transfer", "UPI", "Cheque"], default: "Bank Transfer" },
  transactionId: { type: String },

  // Meta
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.models.Payroll || mongoose.model("Payroll", PayrollSchema);