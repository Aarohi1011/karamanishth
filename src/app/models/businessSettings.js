import mongoose from 'mongoose';

const BusinessSettingsSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    unique: true // One settings document per business
  },

  // Default working hours
  defaultInTime: {
    type: String,
    required: true,
    default: '09:00' // 9 AM
  },
  defaultOutTime: {
    type: String,
    required: true,
    default: '18:00' // 6 PM
  },

  // Default working days (0 = Sunday, 6 = Saturday)
  workingDays: {
    type: [Number],
    default: [1, 2, 3, 4, 5], // Monday to Friday
    validate: {
      validator: arr => arr.every(day => day >= 0 && day <= 6),
      message: 'Working days must be integers between 0 (Sunday) and 6 (Saturday)'
    }
  },

  // Default holidays (you can enhance this later with a calendar-based system)
  weeklyHoliday: {
    type: [Number],
    default: [0] // Sunday as default weekly holiday
  },

  // Lunch break settings
  lunchStartTime: {
    type: String,
    required: true,
    default: '13:00' // 1 PM
  },
  lunchDurationMinutes: {
    type: Number,
    required: true,
    default: 60 // 1 hour
  },

  // Optional: grace period for late check-in
  gracePeriodMinutes: {
    type: Number,
    default: 15
  }
}, {
  timestamps: true
});

export const BusinessSettings = mongoose.models.BusinessSettings || mongoose.model('BusinessSettings', BusinessSettingsSchema);
