import mongoose from 'mongoose';

const EmployeeAttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  inTime: {
    type: Date,
  },
  outTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half-Day', 'Leave', 'Late'],
    default: 'Present'
  },
  workHours: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  deviceInfo: {
    type: String
  }
});

const DailyAttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    default: () => new Date().setHours(0, 0, 0, 0) // Set to start of day
  },
  employees: [EmployeeAttendanceSchema],
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  totalPresent: {
    type: Number,
    default: 0
  },
  totalAbsent: {
    type: Number,
    default: 0
  },
  totalLate: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Indexes
DailyAttendanceSchema.index({ date: 1, business: 1 }, { unique: true });
DailyAttendanceSchema.index({ 'employees.employee': 1 });

// Calculate work hours and statistics before saving
DailyAttendanceSchema.pre('save', function(next) {
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;

  this.employees.forEach(emp => {
    if (emp.inTime && emp.outTime) {
      const diffInMs = emp.outTime - emp.inTime;
      emp.workHours = parseFloat((diffInMs / (1000 * 60 * 60)).toFixed(2));
      
      // Auto-set status based on work hours
      if (emp.workHours < 4) {
        emp.status = 'Half-Day';
      } else if (emp.workHours >= 4 && emp.workHours < 8) {
        emp.status = 'Present';
      }

      // Check for late arrival (assuming 10AM is the cutoff)
      const lateThreshold = new Date(emp.inTime);
      lateThreshold.setHours(10, 0, 0, 0);
      if (emp.inTime > lateThreshold) {
        emp.status = 'Late';
      }
    }

    // Count statuses
    if (emp.status === 'Present' || emp.status === 'Half-Day') presentCount++;
    if (emp.status === 'Absent') absentCount++;
    if (emp.status === 'Late') lateCount++;
  });

  this.totalPresent = presentCount;
  this.totalAbsent = absentCount;
  this.totalLate = lateCount;

  next();
});

export const DailyAttendance = mongoose.models.DailyAttendance || 
  mongoose.model('DailyAttendance', DailyAttendanceSchema);