const express = require('express');
const router = express.Router();
const {
  generateYieldPrediction,
  generateProfitForecast,
  optimizeExpenses,
  recommendCrop,
  analyzePestRisk,
  getAIHistory
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/predict-yield', generateYieldPrediction);
router.post('/predict-profit', generateProfitForecast);
router.post('/optimize-expenses', optimizeExpenses);
router.post('/recommend-crop', recommendCrop);
router.post('/analyze-pest-risk', analyzePestRisk);
router.get('/history', getAIHistory);

module.exports = router;
