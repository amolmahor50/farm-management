const mongoose = require('mongoose');

const knowledgeContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  contentType: {
    type: String,
    enum: ['article', 'video', 'pdf', 'tutorial', 'guide', 'infographic', 'other'],
    required: true
  },
  category: {
    type: String,
    enum: ['crop_management', 'pest_control', 'soil_management', 'irrigation', 'fertilization', 'harvesting', 'post_harvest', 'market', 'technology', 'government_schemes', 'other'],
    required: true
  },
  subCategory: String,
  content: {
    text: String,
    html: String
  },
  media: {
    type: {
      type: String,
      enum: ['image', 'video', 'pdf', 'audio']
    },
    url: String,
    thumbnailUrl: String,
    duration: Number,
    size: Number
  },
  language: {
    type: String,
    default: 'en'
  },
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  authorName: String,
  source: String,
  externalUrl: String,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  estimatedReadTime: Number,
  crops: [String],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: Date,
  relatedContent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KnowledgeContent'
  }]
}, {
  timestamps: true
});

knowledgeContentSchema.index({ category: 1, isPublished: 1 });
knowledgeContentSchema.index({ tags: 1 });
knowledgeContentSchema.index({ views: -1, likesCount: -1 });
knowledgeContentSchema.index({ crops: 1 });

module.exports = mongoose.model('KnowledgeContent', knowledgeContentSchema);
