const express = require('express');
const router = express.Router();
const {
  createSubscription,
  verifySubscriptionPayment,
  getSubscription,
  cancelSubscription
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/subscription/create', createSubscription);
router.post('/subscription/verify', verifySubscriptionPayment);
router.get('/subscription', getSubscription);
router.post('/subscription/cancel', cancelSubscription);

module.exports = router;
