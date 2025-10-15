const express = require('express');
const router = express.Router();
const {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllExpenses)
  .post(createExpense);

router.get('/stats', getExpenseStats);

router.route('/:id')
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
