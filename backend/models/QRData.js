const mongoose = require('mongoose');

const qrDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  qrCode: {
    type: String,
    required: true,
    unique: true
  },
  barcodeType: {
    type: String,
    enum: ['qr', 'ean', 'upc', 'code128', 'other']
  },
  itemType: {
    type: String,
    enum: ['seed', 'fertilizer', 'pesticide', 'equipment', 'produce', 'input', 'other'],
    required: true
  },
  productInfo: {
    name: {
      type: String,
      required: true
    },
    brand: String,
    category: String,
    subCategory: String,
    batch: String,
    sku: String
  },
  quantity: {
    value: Number,
    unit: String
  },
  purchaseDetails: {
    vendor: String,
    purchaseDate: Date,
    price: Number,
    invoiceNumber: String
  },
  expiryDate: Date,
  manufacturingDate: Date,
  composition: String,
  usageInstructions: String,
  storage: {
    location: String,
    conditions: String,
    currentStock: Number
  },
  usageHistory: [{
    date: Date,
    quantityUsed: Number,
    cropApplied: String,
    purpose: String,
    notes: String
  }],
  images: [{
    url: String,
    type: {
      type: String,
      enum: ['product', 'label', 'invoice', 'other']
    }
  }],
  certifications: [{
    name: String,
    number: String,
    issuedBy: String
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['expiry', 'low_stock', 'recall', 'other']
    },
    message: String,
    date: Date
  }],
  linkedExpense: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense'
  },
  status: {
    type: String,
    enum: ['in_stock', 'in_use', 'depleted', 'expired', 'disposed'],
    default: 'in_stock'
  },
  notes: String,
  tags: [String]
}, {
  timestamps: true
});

qrDataSchema.index({ user: 1, qrCode: 1 });
qrDataSchema.index({ user: 1, itemType: 1 });
qrDataSchema.index({ expiryDate: 1, status: 1 });

module.exports = mongoose.model('QRData', qrDataSchema);
