const Expense = require('../models/Expense');
const Yield = require('../models/Yield');
const Loan = require('../models/Loan');
const Task = require('../models/Task');

exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const expenseQuery = { user: userId };
    const yieldQuery = { user: userId };
    if (Object.keys(dateFilter).length > 0) {
      expenseQuery.date = dateFilter;
      yieldQuery.plantingDate = dateFilter;
    }

    const [
      totalExpenses,
      expensesByCategory,
      totalYield,
      activeLoans,
      pendingTasks,
      recentExpenses,
      recentYields
    ] = await Promise.all([
      Expense.aggregate([
        { $match: expenseQuery },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Expense.aggregate([
        { $match: expenseQuery },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]),
      Yield.aggregate([
        { $match: { ...yieldQuery, status: 'sold' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$sellingPrice.totalPrice' },
            totalQuantity: { $sum: '$quantity' }
          }
        }
      ]),
      Loan.countDocuments({ user: userId, status: 'active' }),
      Task.countDocuments({ user: userId, status: { $in: ['pending', 'overdue'] } }),
      Expense.find(expenseQuery).sort({ date: -1 }).limit(5),
      Yield.find(yieldQuery).sort({ plantingDate: -1 }).limit(5)
    ]);

    const totalExpenseAmount = totalExpenses[0]?.total || 0;
    const totalRevenue = totalYield[0]?.totalRevenue || 0;
    const profitLoss = totalRevenue - totalExpenseAmount;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalExpenses: totalExpenseAmount,
          totalRevenue,
          profitLoss,
          activeLoans,
          pendingTasks
        },
        expensesByCategory,
        recentExpenses,
        recentYields
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.quickAddExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({
      user: req.user.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

exports.quickAddYield = async (req, res, next) => {
  try {
    const yieldData = await Yield.create({
      user: req.user.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Yield added successfully',
      data: yieldData
    });
  } catch (error) {
    next(error);
  }
};

exports.quickAddLoan = async (req, res, next) => {
  try {
    const loan = await Loan.create({
      user: req.user.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Loan added successfully',
      data: loan
    });
  } catch (error) {
    next(error);
  }
};

exports.getChartData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, period } = req.query;

    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    let chartData = [];

    if (type === 'expense') {
      chartData = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            total: { $sum: '$amount' }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    } else if (type === 'yield') {
      chartData = await Yield.aggregate([
        { $match: { user: userId, plantingDate: { $gte: startDate } } },
        {
          $group: {
            _id: '$cropName',
            totalQuantity: { $sum: '$quantity' },
            totalRevenue: { $sum: '$sellingPrice.totalPrice' }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ]);
    }

    res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error) {
    next(error);
  }
};
