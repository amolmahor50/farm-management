const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  expertise: {
    type: [String],
    required: true,
    enum: ['crop_management', 'pest_disease', 'soil_science', 'irrigation', 'organic_farming', 'horticulture', 'agronomy', 'veterinary', 'farm_equipment', 'market_analysis', 'other']
  },
  qualification: {
    degree: String,
    institution: String,
    year: Number,
    certificates: [{
      name: String,
      issuedBy: String,
      year: Number,
      url: String
    }]
  },
  experience: {
    years: {
      type: Number,
      required: true
    },
    description: String
  },
  languages: [String],
  availability: {
    status: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available'
    },
    schedule: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      slots: [{
        startTime: String,
        endTime: String
      }]
    }]
  },
  consultationFees: {
    chat: Number,
    call: Number,
    video: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  consultations: [{
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['chat', 'call', 'video']
    },
    topic: String,
    date: Date,
    duration: Number,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no_show']
    },
    fee: Number,
    rating: Number,
    feedback: String
  }],
  totalConsultations: {
    type: Number,
    default: 0
  },
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    paid: {
      type: Number,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String,
    url: String
  }],
  bio: String,
  profileImage: String,
  socialLinks: {
    website: String,
    linkedin: String,
    twitter: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

expertSchema.index({ 'user': 1 });
expertSchema.index({ 'expertise': 1 });
expertSchema.index({ 'rating.average': -1 });
expertSchema.index({ 'availability.status': 1 });

module.exports = mongoose.model('Expert', expertSchema);
