const express = require('express');
const router = express.Router();
const {
  getAllQRData,
  getQRData,
  createQRData,
  scanQRCode,
  recordUsage
} = require('../controllers/qrController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllQRData)
  .post(createQRData);

router.post('/scan', scanQRCode);

router.route('/:id')
  .get(getQRData);

router.post('/:id/usage', recordUsage);

module.exports = router;
