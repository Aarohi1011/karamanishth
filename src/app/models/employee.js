import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String },
  businessName : { type:String },
  role: {
    type: String,
    enum: ['Owner' , 'Manager', 'Head', 'Staff']
  },
  experience: { type: String },
  bio: { type: String },
  skills: { type: [String], default: [] },

  // Compensation
  salary: { type: String },

  // System Access
  password: {
    type: String,
    default: function () {
      return this.phone;
    }
  },


  // Additional Details
  joinDate: { type: Date, default: Date.now },

  // Permissions
  permissions: { type: [String], default: [] },

  active: { type: Boolean, default: true },
  lastLogin: { type: Date },
  subscription: { type: Object },

}, { timestamps: true });

export const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
