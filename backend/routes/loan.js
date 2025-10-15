const express = require('express');
const router = express.Router();
const {
  getAllLoans,
  getLoan,
  createLoan,
  updateLoan,
  deleteLoan,
  recordEMIPayment,
  getUpcomingEMIs
} = require('../controllers/loanController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllLoans)
  .post(createLoan);

router.get('/upcoming-emis', getUpcomingEMIs);

router.route('/:id')
  .get(getLoan)
  .put(updateLoan)
  .delete(deleteLoan);

router.post('/:id/emi-payment', recordEMIPayment);

module.exports = router;
