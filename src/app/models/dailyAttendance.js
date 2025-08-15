import mongoose from 'mongoose';

const EmployeeAttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  inTime: {
    type: Date
  },
  outTime: {
    type: Date
  },

  // New separate statuses
  inStatus: {
    type: String,
    enum: ['On Time', 'Late', 'Absent', 'Half-Day', 'Leave'],
    default: 'Absent'
  },
  outStatus: {
    type: String,
    enum: ['On Time', 'Early Leave', 'Absent', 'Half-Day', 'Leave'],
    default: 'Absent'
  },

  workHours: {
    type: Number,
    default: 0
  },
  notes: String,
  deviceInfo: String
});

const DailyAttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0) // Start of day
  },
  employees: [EmployeeAttendanceSchema],
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  totalPresent: { type: Number, default: 0 },
  totalAbsent: { type: Number, default: 0 },
  totalLateArrivals: { type: Number, default: 0 },
  totalEarlyLeaves: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes
DailyAttendanceSchema.index({ date: 1, business: 1 }, { unique: true });
DailyAttendanceSchema.index({ 'employees.employee': 1 });

// Pre-save calculation logic
// Pre-save calculation logic
DailyAttendanceSchema.pre('save', function (next) {
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let earlyLeaveCount = 0;

  this.employees.forEach(emp => {
    // Calculate work hours if both inTime & outTime exist
    if (emp.inTime && emp.outTime) {
      const diffInMs = emp.outTime - emp.inTime;
      emp.workHours = parseFloat((diffInMs / (1000 * 60 * 60)).toFixed(2));
    }

    // Only set statuses if not already set
    if (!emp.inStatus) emp.inStatus = 'Absent';
    if (!emp.outStatus) emp.outStatus = 'Absent';

    // Counting stats
    if (emp.inStatus !== 'Absent' && emp.outStatus !== 'Absent') {
      presentCount++;
    }
    if (emp.inStatus === 'Absent' || emp.outStatus === 'Absent') {
      absentCount++;
    }
    if (emp.inStatus === 'Late') lateCount++;
    if (emp.outStatus === 'Early Leave') earlyLeaveCount++;
  });

  this.totalPresent = presentCount;
  this.totalAbsent = absentCount;
  this.totalLateArrivals = lateCount;
  this.totalEarlyLeaves = earlyLeaveCount;

  next();
});


export const DailyAttendance =
  mongoose.models.DailyAttendance ||
  mongoose.model('DailyAttendance', DailyAttendanceSchema);
