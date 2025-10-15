const express = require('express');
const router = express.Router();
const {
  getAllExperts,
  getExpert,
  createExpertProfile,
  bookConsultation,
  rateExpert
} = require('../controllers/expertController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getAllExperts);
router.get('/:id', optionalAuth, getExpert);

router.use(protect);

router.post('/profile', createExpertProfile);
router.post('/book-consultation', bookConsultation);
router.post('/:id/rate', rateExpert);

module.exports = router;
