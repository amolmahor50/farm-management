const AIData = require('../models/AIData');
const Expense = require('../models/Expense');
const Yield = require('../models/Yield');
const { predictYield, predictProfit, optimizeExpenses, recommendCrop, analyzePestRisk } = require('../utils/aiUtils');

exports.generateYieldPrediction = async (req, res, next) => {
  try {
    const { cropName, area, soilType, season } = req.body;

    const historicalYields = await Yield.find({
      user: req.user.id,
      cropName,
      status: 'harvested'
    }).select('quantity').lean();

    const historicalYieldValues = historicalYields.map(y => y.quantity);

    const prediction = await predictYield({
      cropName,
      area,
      soilType,
      season,
      historicalYield: historicalYieldValues
    });

    const aiData = await AIData.create({
      user: req.user.id,
      analysisType: 'yield_prediction',
      inputData: { cropName, area, soilType, season, historicalYield: historicalYieldValues },
      predictions: {
        predictedYield: prediction.predictedYield
      }
    });

    res.status(200).json({
      success: true,
      data: aiData
    });
  } catch (error) {
    next(error);
  }
};

exports.generateProfitForecast = async (req, res, next) => {
  try {
    const { cropName, predictedYield, marketPrice } = req.body;

    const expenses = await Expense.find({
      user: req.user.id,
      cropAssociated: req.body.cropId
    });

    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const prediction = await predictProfit({
      predictedYield,
      marketPrice,
      totalExpense
    });

    const aiData = await AIData.create({
      user: req.user.id,
      analysisType: 'profit_forecast',
      inputData: { cropName, predictedYield, marketPrice, totalExpense },
      predictions: {
        predictedProfit: prediction.predictedProfit
      }
    });

    res.status(200).json({
      success: true,
      data: aiData
    });
  } catch (error) {
    next(error);
  }
};

exports.optimizeExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).lean();

    const optimization = await optimizeExpenses(expenses);

    const aiData = await AIData.create({
      user: req.user.id,
      analysisType: 'expense_optimization',
      inputData: { expenses: expenses.length },
      recommendations: optimization.recommendations.map(r => ({
        type: 'expense_optimization',
        recommendation: r.suggestion,
        expectedBenefit: `Potential saving: ₹${r.potentialSaving}`
      }))
    });

    res.status(200).json({
      success: true,
      data: {
        ...optimization,
        aiDataId: aiData._id
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.recommendCrop = async (req, res, next) => {
  try {
    const { soilType, season, location } = req.body;

    const recommendation = await recommendCrop({
      soilType,
      season,
      location
    });

    const aiData = await AIData.create({
      user: req.user.id,
      analysisType: 'crop_recommendation',
      inputData: { soilType, season, location },
      recommendations: recommendation.recommendedCrops.map(crop => ({
        type: 'crop_selection',
        recommendation: `Plant ${crop.name}`,
        reasoning: recommendation.reasoning,
        expectedBenefit: crop.expectedYield
      }))
    });

    res.status(200).json({
      success: true,
      data: aiData
    });
  } catch (error) {
    next(error);
  }
};

exports.analyzePestRisk = async (req, res, next) => {
  try {
    const { cropName, season, location } = req.body;

    const analysis = await analyzePestRisk({
      cropName,
      season,
      location
    });

    const aiData = await AIData.create({
      user: req.user.id,
      analysisType: 'pest_prediction',
      inputData: { cropName, season, location },
      predictions: {
        risks: analysis.commonPests.map(pest => ({
          type: pest.name,
          probability: parseFloat(pest.probability) / 100,
          impact: 'medium',
          mitigation: pest.preventiveMeasures
        }))
      }
    });

    res.status(200).json({
      success: true,
      data: {
        riskLevel: analysis.riskLevel,
        pests: analysis.commonPests,
        aiDataId: aiData._id
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAIHistory = async (req, res, next) => {
  try {
    const { analysisType, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (analysisType) query.analysisType = analysisType;

    const history = await AIData.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await AIData.countDocuments(query);

    res.status(200).json({
      success: true,
      data: history,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};
