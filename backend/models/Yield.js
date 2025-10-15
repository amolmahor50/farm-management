const mongoose = require('mongoose');

const yieldSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropName: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  cropType: {
    type: String,
    enum: ['cereal', 'pulse', 'vegetable', 'fruit', 'cash_crop', 'other']
  },
  variety: String,
  season: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid', 'perennial']
  },
  plantingDate: {
    type: Date,
    required: true
  },
  harvestDate: Date,
  expectedHarvestDate: Date,
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'quintal', 'ton', 'bag', 'piece', 'other']
  },
  areaUsed: {
    value: Number,
    unit: {
      type: String,
      enum: ['acre', 'hectare', 'bigha', 'guntha']
    }
  },
  qualityGrade: {
    type: String,
    enum: ['A', 'B', 'C', 'D']
  },
  sellingPrice: {
    pricePerUnit: Number,
    totalPrice: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  buyer: {
    name: String,
    phone: String,
    type: {
      type: String,
      enum: ['direct', 'mandi', 'wholesaler', 'retailer', 'contract', 'other']
    }
  },
  status: {
    type: String,
    enum: ['planted', 'growing', 'harvested', 'sold'],
    default: 'planted'
  },
  totalExpense: {
    type: Number,
    default: 0
  },
  profitLoss: Number,
  images: [{
    url: String,
    caption: String,
    uploadDate: Date
  }],
  notes: String,
  weatherConditions: {
    rainfall: Number,
    temperature: {
      min: Number,
      max: Number
    }
  },
  tags: [String]
}, {
  timestamps: true
});

yieldSchema.index({ user: 1, plantingDate: -1 });
yieldSchema.index({ user: 1, cropName: 1 });
yieldSchema.index({ user: 1, status: 1 });

yieldSchema.pre('save', function(next) {
  if (this.sellingPrice && this.sellingPrice.totalPrice && this.totalExpense) {
    this.profitLoss = this.sellingPrice.totalPrice - this.totalExpense;
  }
  next();
});

module.exports = mongoose.model('Yield', yieldSchema);
