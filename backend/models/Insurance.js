const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  policyNumber: {
    type: String,
    required: true,
    unique: true
  },
  insuranceType: {
    type: String,
    enum: ['crop_insurance', 'livestock_insurance', 'farm_equipment_insurance', 'weather_insurance', 'other'],
    required: true
  },
  provider: {
    name: {
      type: String,
      required: true
    },
    phone: String,
    email: String,
    address: String
  },
  cropDetails: {
    cropName: String,
    variety: String,
    areaInsured: {
      value: Number,
      unit: String
    },
    seasonYear: String,
    expectedYield: Number
  },
  coverage: {
    sumInsured: {
      type: Number,
      required: true
    },
    premium: {
      type: Number,
      required: true
    },
    subsidyAmount: Number,
    netPremium: Number,
    coveragePercentage: Number
  },
  policyPeriod: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'claimed', 'cancelled', 'under_review'],
    default: 'active'
  },
  risks: [{
    type: String,
    enum: ['drought', 'flood', 'pest_attack', 'disease', 'fire', 'storm', 'hail', 'frost', 'other']
  }],
  claims: [{
    claimNumber: String,
    claimDate: Date,
    incidentDate: Date,
    incidentType: String,
    claimAmount: Number,
    approvedAmount: Number,
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'rejected', 'paid']
    },
    documents: [{
      name: String,
      url: String,
      uploadDate: Date
    }],
    remarks: String,
    settlementDate: Date
  }],
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadDate: Date
  }],
  nominees: [{
    name: String,
    relation: String,
    phone: String,
    percentage: Number
  }],
  premiumPayments: [{
    amount: Number,
    paymentDate: Date,
    paymentMethod: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed']
    }
  }],
  renewalDate: Date,
  isAutoRenewal: {
    type: Boolean,
    default: false
  },
  notes: String
}, {
  timestamps: true
});

insuranceSchema.index({ user: 1, status: 1 });
insuranceSchema.index({ policyNumber: 1 });
insuranceSchema.index({ 'policyPeriod.endDate': 1 });

module.exports = mongoose.model('Insurance', insuranceSchema);
