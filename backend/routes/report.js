const express = require('express');
const router = express.Router();
const {
  generateReport,
  exportPDF,
  getAnalytics
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/generate', generateReport);
router.get('/export-pdf', exportPDF);
router.get('/analytics', getAnalytics);

module.exports = router;
