const express = require('express');
const router = express.Router();
const {
  getAllInsurances,
  getInsurance,
  createInsurance,
  updateInsurance,
  fileClaim
} = require('../controllers/insuranceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllInsurances)
  .post(createInsurance);

router.route('/:id')
  .get(getInsurance)
  .put(updateInsurance);

router.post('/:id/claim', fileClaim);

module.exports = router;
