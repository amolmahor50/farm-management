const predictYield = async (inputData) => {
  try {
    const { cropName, area, soilType, historicalYield, weatherData } = inputData;

    let avgHistoricalYield = 0;
    if (historicalYield && historicalYield.length > 0) {
      avgHistoricalYield = historicalYield.reduce((a, b) => a + b, 0) / historicalYield.length;
    } else {
      avgHistoricalYield = area * 20;
    }

    const variabilityFactor = 0.85 + Math.random() * 0.3;
    const predictedYield = avgHistoricalYield * variabilityFactor;
    const confidence = 0.65 + Math.random() * 0.25;

    return {
      predictedYield: {
        value: Math.round(predictedYield * 100) / 100,
        unit: 'quintal',
        confidence: Math.round(confidence * 100)
      },
      factors: {
        historical: avgHistoricalYield,
        soilImpact: soilType === 'fertile' ? 'positive' : 'neutral',
        weatherImpact: 'moderate'
      }
    };
  } catch (error) {
    console.error('Error predicting yield:', error);
    throw new Error('Failed to predict yield');
  }
};

const predictProfit = async (inputData) => {
  try {
    const { predictedYield, marketPrice, totalExpense } = inputData;

    const estimatedRevenue = predictedYield * marketPrice;
    const predictedProfit = estimatedRevenue - totalExpense;
    const confidence = 0.60 + Math.random() * 0.25;

    return {
      predictedProfit: {
        value: Math.round(predictedProfit * 100) / 100,
        confidence: Math.round(confidence * 100)
      },
      breakdown: {
        estimatedRevenue,
        totalExpense,
        profitMargin: ((predictedProfit / estimatedRevenue) * 100).toFixed(2)
      }
    };
  } catch (error) {
    console.error('Error predicting profit:', error);
    throw new Error('Failed to predict profit');
  }
};

const optimizeExpenses = async (expenses) => {
  try {
    const categoryExpenses = {};
    let totalExpense = 0;

    expenses.forEach(expense => {
      if (!categoryExpenses[expense.category]) {
        categoryExpenses[expense.category] = 0;
      }
      categoryExpenses[expense.category] += expense.amount;
      totalExpense += expense.amount;
    });

    const recommendations = [];

    Object.keys(categoryExpenses).forEach(category => {
      const percentage = (categoryExpenses[category] / totalExpense) * 100;

      if (percentage > 30) {
        recommendations.push({
          category,
          currentSpending: categoryExpenses[category],
          percentage: percentage.toFixed(2),
          suggestion: `High spending in ${category}. Consider bulk purchasing or alternative suppliers.`,
          potentialSaving: (categoryExpenses[category] * 0.15).toFixed(2)
        });
      }
    });

    return {
      totalExpense,
      categoryBreakdown: categoryExpenses,
      recommendations,
      optimizationPotential: recommendations.reduce((sum, r) => sum + parseFloat(r.potentialSaving), 0)
    };
  } catch (error) {
    console.error('Error optimizing expenses:', error);
    throw new Error('Failed to optimize expenses');
  }
};

const recommendCrop = async (inputData) => {
  try {
    const { soilType, season, location } = inputData;

    const cropDatabase = {
      fertile: {
        kharif: ['Rice', 'Cotton', 'Sugarcane'],
        rabi: ['Wheat', 'Mustard', 'Chickpea'],
        zaid: ['Watermelon', 'Cucumber', 'Bitter Gourd']
      },
      loamy: {
        kharif: ['Maize', 'Soybean', 'Groundnut'],
        rabi: ['Barley', 'Peas', 'Lentils'],
        zaid: ['Muskmelon', 'Vegetables']
      },
      clay: {
        kharif: ['Paddy', 'Jute', 'Sugarcane'],
        rabi: ['Wheat', 'Gram', 'Linseed'],
        zaid: ['Vegetables']
      }
    };

    const recommendations = cropDatabase[soilType]?.[season] || ['Consult agricultural expert'];

    return {
      recommendedCrops: recommendations.map(crop => ({
        name: crop,
        suitability: 'high',
        expectedYield: '20-30 quintal/acre',
        marketDemand: 'good'
      })),
      reasoning: `Based on ${soilType} soil and ${season} season`
    };
  } catch (error) {
    console.error('Error recommending crop:', error);
    throw new Error('Failed to recommend crop');
  }
};

const analyzePestRisk = async (inputData) => {
  try {
    const { cropName, season, weatherData, location } = inputData;

    const riskLevel = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];

    const commonPests = {
      Rice: ['Brown Planthopper', 'Stem Borer', 'Leaf Folder'],
      Wheat: ['Aphids', 'Termites', 'Army Worm'],
      Cotton: ['Bollworm', 'Whitefly', 'Aphids']
    };

    const pests = commonPests[cropName] || ['Consult expert for pest information'];

    return {
      riskLevel,
      commonPests: pests.map(pest => ({
        name: pest,
        probability: (Math.random() * 100).toFixed(0) + '%',
        preventiveMeasures: `Regular monitoring and timely pesticide application`
      })),
      weatherImpact: 'Humid conditions may increase pest activity'
    };
  } catch (error) {
    console.error('Error analyzing pest risk:', error);
    throw new Error('Failed to analyze pest risk');
  }
};

module.exports = {
  predictYield,
  predictProfit,
  optimizeExpenses,
  recommendCrop,
  analyzePestRisk
};
