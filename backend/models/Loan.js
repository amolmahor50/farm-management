const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loanType: {
    type: String,
    required: true,
    enum: ['crop_loan', 'equipment_loan', 'land_loan', 'personal_loan', 'micro_loan', 'other']
  },
  lender: {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['bank', 'cooperative', 'private_lender', 'government', 'ngo', 'other']
    },
    phone: String,
    address: String
  },
  principal: {
    type: Number,
    required: [true, 'Principal amount is required'],
    min: 0
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0
  },
  interestType: {
    type: String,
    enum: ['simple', 'compound'],
    default: 'simple'
  },
  tenure: {
    months: {
      type: Number,
      required: true
    }
  },
  emiAmount: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  disbursementDate: Date,
  purpose: String,
  totalAmount: Number,
  totalPaid: {
    type: Number,
    default: 0
  },
  remainingAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'defaulted', 'closed'],
    default: 'pending'
  },
  emiSchedule: [{
    emiNumber: Number,
    dueDate: Date,
    amount: Number,
    principal: Number,
    interest: Number,
    isPaid: {
      type: Boolean,
      default: false
    },
    paidDate: Date,
    paidAmount: Number,
    lateFee: Number
  }],
  documents: [{
    name: String,
    url: String,
    uploadDate: Date
  }],
  collateral: {
    type: String,
    description: String
  },
  guarantor: {
    name: String,
    phone: String,
    relation: String
  },
  notes: String,
  reminders: {
    enabled: {
      type: Boolean,
      default: true
    },
    daysBefore: {
      type: Number,
      default: 3
    }
  }
}, {
  timestamps: true
});

loanSchema.index({ user: 1, status: 1 });
loanSchema.index({ 'emiSchedule.dueDate': 1 });

loanSchema.pre('save', function(next) {
  this.totalAmount = this.principal + (this.principal * this.interestRate * this.tenure.months) / (100 * 12);
  this.remainingAmount = this.totalAmount - this.totalPaid;

  if (this.startDate && this.tenure && this.tenure.months) {
    this.endDate = new Date(this.startDate);
    this.endDate.setMonth(this.endDate.getMonth() + this.tenure.months);
  }

  next();
});

module.exports = mongoose.model('Loan', loanSchema);
