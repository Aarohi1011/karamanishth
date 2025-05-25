import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  
  // Professional Information
  position: { type: String, required: true },
  department: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String },
  skills: { type: [String], default: [] },
  
  // Compensation
  salary: { type: String, required: true },
  
  // System Access
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['Management', 'Head', 'Developer', 'Analyst', 'Staff'] 
  },
  
  // Additional Details
  
  joinDate: { type: Date, default: Date.now },
  
  // Permissions
  permissions: { type: [String], default: [] },
  
  
  active: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

export const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);