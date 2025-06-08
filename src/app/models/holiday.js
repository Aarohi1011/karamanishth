import mongoose from 'mongoose';

const HolidaySchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  recurring: {
    type: Boolean,
    default: false
  },
  // For recurring holidays (like annual holidays)
  recurrencePattern: {
    type: String,
    enum: ['yearly', 'monthly', 'weekly', null],
    default: null
  },
  // For weekly holidays from BusinessSettings
  isWeeklyHoliday: {
    type: Boolean,
    default: false
  },
  // For custom one-time holidays
  isCustomHoliday: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate holidays for same business on same date
HolidaySchema.index({ business: 1, date: 1 }, { unique: true });

// Pre-save hook to normalize date (remove time component)
HolidaySchema.pre('save', function(next) {
  if (this.date) {
    this.date = new Date(this.date.setHours(0, 0, 0, 0));
  }
  next();
});

export const Holiday = mongoose.models.Holiday || mongoose.model('Holiday', HolidaySchema);