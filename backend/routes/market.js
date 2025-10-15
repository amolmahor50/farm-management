const express = require('express');
const router = express.Router();
const {
  getCropPrices,
  addCropPrice,
  getPriceTrends,
  getSuppliers
} = require('../controllers/marketController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/prices', optionalAuth, getCropPrices);
router.get('/prices/trends/:cropName', optionalAuth, getPriceTrends);
router.get('/suppliers', optionalAuth, getSuppliers);

router.post('/prices', protect, addCropPrice);

module.exports = router;
