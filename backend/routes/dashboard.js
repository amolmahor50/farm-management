const express = require("express");
const router = express.Router();
const {
  getDashboardSummary,
  quickAddExpense,
  quickAddYield,
  quickAddLoan,
  getChartData,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/summary", getDashboardSummary);
router.post("/quick-add/expense", quickAddExpense);
router.post("/quick-add/yield", quickAddYield);
router.post("/quick-add/loan", quickAddLoan);
router.get("/charts", getChartData);

module.exports = router;
