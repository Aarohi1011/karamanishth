import mongoose from 'mongoose';

// Helper function to calculate expiry date (1 month from now)
const oneMonthFromNow = () => {
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  return now;
};


const BusinessSchema = new mongoose.Schema({
  // Step 1 - Business Info
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },

  // Step 2 - Contact Info
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // Subscription Info
  subscription: {
     planName: { type: String, required: true, default: 'Free' },       // Default plan is "Free"
    expiryDate: { type: Date, required: true, default: oneMonthFromNow } // 1 month from creation
  }
}, {
  timestamps: true
});

export const Business = mongoose.models.Business || mongoose.model('Business', BusinessSchema);
