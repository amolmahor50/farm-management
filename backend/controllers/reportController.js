const Expense = require('../models/Expense');
const Yield = require('../models/Yield');
const Loan = require('../models/Loan');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

exports.generateReport = async (req, res, next) => {
  try {
    const { type, format, startDate, endDate } = req.query;

    let data = [];
    let fields = [];

    if (type === 'expense') {
      data = await Expense.find({
        user: req.user.id,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }).lean();
      fields = ['category', 'amount', 'description', 'date', 'paymentMethod'];
    } else if (type === 'yield') {
      data = await Yield.find({
        user: req.user.id,
        plantingDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }).lean();
      fields = ['cropName', 'quantity', 'unit', 'sellingPrice.totalPrice', 'status'];
    } else if (type === 'loan') {
      data = await Loan.find({ user: req.user.id }).lean();
      fields = ['loanType', 'principal', 'interestRate', 'emiAmount', 'status'];
    }

    if (format === 'csv') {
      const parser = new Parser({ fields });
      const csv = parser.parse(data);

      res.header('Content-Type', 'text/csv');
      res.attachment(`${type}_report.csv`);
      return res.send(csv);
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.exportPDF = async (req, res, next) => {
  try {
    const doc = new PDFDocument();

    res.header('Content-Type', 'application/pdf');
    res.attachment('farm_report.pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Farm Management Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toDateString()}`);
    doc.moveDown();

    doc.end();
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [expenseAnalytics, yieldAnalytics] = await Promise.all([
      Expense.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: { $month: '$date' },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Yield.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: '$cropName',
            totalQuantity: { $sum: '$quantity' },
            avgPrice: { $avg: '$sellingPrice.pricePerUnit' }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        expenseAnalytics,
        yieldAnalytics
      }
    });
  } catch (error) {
    next(error);
  }
};
