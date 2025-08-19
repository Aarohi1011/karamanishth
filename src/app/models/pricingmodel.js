import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  // School/User identification
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Transaction details
  transactionId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'refunded'],
    default: 'pending',
  },
  
  // Pricing details
  pricePerEmployee: { type: Number, required: true }, // Will be set dynamically
  employeeCount: { type: Number, required: true },
  planDurationMonths: { type: Number, required: true }, // 1, 6, or 12
  
  // Calculated amounts
  baseAmount: { type: Number, required: true }, // pricePerEmployee * employeeCount * duration
  finalAmount: { type: Number, required: true }, // Same as baseAmount since no extra discounts now
  
  // Payment details
  currency: { type: String, default: 'INR' },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'wallet'],
    required: true,
  },
  
  // Plan information
  planName: { type: String, required: true },
  
  // Timestamps
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
  verifiedBy: { type: String },
  adminNote: { type: String },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for displaying duration with label
TransactionSchema.virtual('durationLabel').get(function() {
  const durations = {
    1: '1 Month',
    6: '6 Months',
    12: '1 Year'
  };
  return durations[this.planDurationMonths] || `${this.planDurationMonths} Months`;
});

// Pre-save hook to set pricing and calculate amounts
TransactionSchema.pre('save', function(next) {
  // Define pricing based on duration
  const pricing = {
    1: 30,   // ₹30/employee/month
    6: 20,   // ₹20/employee/month
    12: 10   // ₹10/employee/month
  };

  // Set pricePerEmployee
  this.pricePerEmployee = pricing[this.planDurationMonths] || 30;

  // Calculate base amount
  this.baseAmount = this.pricePerEmployee * this.employeeCount * this.planDurationMonths;

  // No discounts → finalAmount = baseAmount
  this.finalAmount = this.baseAmount;

  next();
});

// Static method to create transaction with pricing logic
TransactionSchema.statics.createTransaction = async function(transactionData) {
  const pricing = {
    1: 30,
    6: 20,
    12: 10
  };

  // Ensure correct price per employee
  transactionData.pricePerEmployee = pricing[transactionData.planDurationMonths] || 30;

  // Calculate base and final amount
  transactionData.baseAmount = transactionData.pricePerEmployee * transactionData.employeeCount * transactionData.planDurationMonths;
  transactionData.finalAmount = transactionData.baseAmount;

  const transaction = new this(transactionData);
  await transaction.save();
  return transaction;
};

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
