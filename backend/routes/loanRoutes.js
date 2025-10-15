import express from 'express';
import {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
  getLoanRepayments,
  addLoanRepayment,
} from '../controllers/loanController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getLoans).post(protect, createLoan);
router.route('/:id').get(protect, getLoanById).put(protect, updateLoan).delete(protect, deleteLoan);
router.route('/:loanId/repayments').get(protect, getLoanRepayments).post(protect, addLoanRepayment);

export default router;
