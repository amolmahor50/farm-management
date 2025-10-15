const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
    trim: true
  },
  variety: String,
  market: {
    name: String,
    location: {
      state: String,
      district: String,
      city: String
    }
  },
  priceData: {
    minPrice: Number,
    maxPrice: Number,
    modalPrice: Number,
    unit: {
      type: String,
      default: 'quintal'
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ['agmarknet', 'mandi', 'api', 'manual', 'other']
  },
  suppliers: [{
    name: String,
    productType: {
      type: String,
      enum: ['seeds', 'fertilizer', 'pesticide', 'equipment', 'other']
    },
    phone: String,
    location: String,
    rating: Number,
    priceRange: {
      min: Number,
      max: Number
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  priceHistory: [{
    date: Date,
    price: Number
  }],
  demand: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  quality: String
}, {
  timestamps: true
});

marketSchema.index({ cropName: 1, date: -1 });
marketSchema.index({ 'market.location.state': 1, 'market.location.district': 1 });

module.exports = mongoose.model('Market', marketSchema);
