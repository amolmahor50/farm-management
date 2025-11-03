const Loan = require("../models/Loan");
const Notification = require("../models/Notification");

exports.getAllLoans = async (req, res, next) => {
  try {
    const { status, loanType, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;
    if (loanType) query.loanType = loanType;

    const loans = await Loan.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Loan.countDocuments(query);

    res.status(200).json({
      success: true,
      data: loans,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    res.status(200).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    next(error);
  }
};

exports.createLoan = async (req, res, next) => {
  try {
    const loan = await Loan.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Loan created successfully",
      data: loan,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Loan updated successfully",
      data: loan,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Loan deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.recordEMIPayment = async (req, res, next) => {
  try {
    const { emiNumber, paidAmount, paidDate } = req.body;

    const loan = await Loan.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    const emiIndex = loan.emiSchedule.findIndex(
      (emi) => emi.emiNumber === emiNumber
    );

    if (emiIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "EMI not found",
      });
    }

    loan.emiSchedule[emiIndex].isPaid = true;
    loan.emiSchedule[emiIndex].paidDate = paidDate || Date.now();
    loan.emiSchedule[emiIndex].paidAmount = paidAmount;

    loan.totalPaid += paidAmount;
    loan.remainingAmount = loan.totalAmount - loan.totalPaid;

    if (loan.remainingAmount <= 0) {
      loan.status = "completed";
    }

    await loan.save();

    res.status(200).json({
      success: true,
      message: "EMI payment recorded successfully",
      data: loan,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUpcomingEMIs = async (req, res, next) => {
  try {
    const loans = await Loan.find({
      user: req.user.id,
      status: "active",
    });

    const upcomingEMIs = [];

    loans.forEach((loan) => {
      const unpaidEMIs = loan.emiSchedule.filter((emi) => !emi.isPaid);
      unpaidEMIs.forEach((emi) => {
        upcomingEMIs.push({
          loanId: loan._id,
          loanType: loan.loanType,
          lender: loan.lender.name,
          emiNumber: emi.emiNumber,
          amount: emi.amount,
          dueDate: emi.dueDate,
        });
      });
    });

    upcomingEMIs.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    res.status(200).json({
      success: true,
      data: upcomingEMIs,
    });
  } catch (error) {
    next(error);
  }
};
