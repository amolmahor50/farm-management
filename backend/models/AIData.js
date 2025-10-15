const mongoose = require('mongoose');

const aiDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analysisType: {
    type: String,
    enum: ['yield_prediction', 'expense_optimization', 'profit_forecast', 'crop_recommendation', 'pest_prediction', 'weather_impact', 'market_trend', 'other'],
    required: true
  },
  inputData: {
    cropName: String,
    season: String,
    area: Number,
    soilType: String,
    historicalYield: [Number],
    expenses: [Number],
    weatherData: mongoose.Schema.Types.Mixed,
    marketData: mongoose.Schema.Types.Mixed,
    other: mongoose.Schema.Types.Mixed
  },
  predictions: {
    predictedYield: {
      value: Number,
      unit: String,
      confidence: Number
    },
    predictedProfit: {
      value: Number,
      confidence: Number
    },
    predictedExpense: {
      value: Number,
      confidence: Number
    },
    recommendedActions: [{
      action: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      expectedImpact: String,
      timing: String
    }],
    risks: [{
      type: String,
      probability: Number,
      impact: String,
      mitigation: String
    }],
    opportunities: [{
      description: String,
      potentialGain: Number,
      feasibility: String
    }]
  },
  insights: [{
    category: String,
    insight: String,
    dataPoints: [mongoose.Schema.Types.Mixed],
    importance: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  recommendations: [{
    type: {
      type: String,
      enum: ['crop_selection', 'planting_time', 'fertilizer', 'irrigation', 'pest_control', 'harvesting', 'market_timing', 'other']
    },
    recommendation: String,
    reasoning: String,
    expectedBenefit: String,
    cost: Number
  }],
  modelUsed: {
    name: String,
    version: String,
    accuracy: Number,
    lastTrained: Date
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  validUntil: Date,
  actualOutcome: {
    yield: Number,
    profit: Number,
    expense: Number,
    notes: String,
    recordedAt: Date
  },
  accuracy: {
    yieldAccuracy: Number,
    profitAccuracy: Number,
    overallAccuracy: Number
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    wasHelpful: Boolean,
    comments: String
  },
  visualizations: [{
    type: {
      type: String,
      enum: ['chart', 'graph', 'map', 'table']
    },
    data: mongoose.Schema.Types.Mixed,
    imageUrl: String
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  }
}, {
  timestamps: true
});

aiDataSchema.index({ user: 1, createdAt: -1 });
aiDataSchema.index({ user: 1, analysisType: 1 });
aiDataSchema.index({ generatedAt: -1 });

module.exports = mongoose.model('AIData', aiDataSchema);
