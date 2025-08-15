import mongoose from 'mongoose';

const BusinessSettingsSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    unique: true // One settings document per business
  },

  // Business location (only coordinates)
  coordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90,
      required: true
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
      required: true
    }
  },

  // Allowed distance from business location (in meters)
  radiusMeters: {
    type: Number,
    required: true,
    default: 100, // default 100 meters
    min: 1,
    max: 50000 // limit to reasonable range
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
    default: [1, 2, 3, 4, 5],
    validate: {
      validator: arr => arr.every(day => day >= 0 && day <= 6),
      message: 'Working days must be integers between 0 (Sunday) and 6 (Saturday)'
    }
  },

  // Default holidays
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

  // Grace period for late check-in
  gracePeriodMinutes: {
    type: Number,
    default: 15
  }
}, {
  timestamps: true
});

export const BusinessSettings =
  mongoose.models.BusinessSettings ||
  mongoose.model('BusinessSettings', BusinessSettingsSchema);
