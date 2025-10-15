const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    required: true
  },
  planDetails: {
    name: String,
    price: Number,
    duration: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    features: [String]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'expired', 'trial'],
    default: 'inactive'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  paymentHistory: [{
    transactionId: String,
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded']
    },
    paymentMethod: String,
    paymentDate: Date,
    invoice: String
  }],
  trialUsed: {
    type: Boolean,
    default: false
  },
  trialEndDate: Date,
  cancelledAt: Date,
  cancelReason: String,
  nextBillingDate: Date,
  discount: {
    code: String,
    percentage: Number,
    amount: Number
  }
}, {
  timestamps: true
});

subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
