const Yield = require("../models/Yield");

exports.getAllYields = async (req, res, next) => {
  try {
    const { status, cropName, season, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;
    if (cropName) query.cropName = new RegExp(cropName, "i");
    if (season) query.season = season;

    const yields = await Yield.find(query)
      .sort({ plantingDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Yield.countDocuments(query);

    res.status(200).json({
      success: true,
      data: yields,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

exports.getYield = async (req, res, next) => {
  try {
    const yieldData = await Yield.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!yieldData) {
      return res.status(404).json({
        success: false,
        message: "Yield record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: yieldData,
    });
  } catch (error) {
    next(error);
  }
};

exports.createYield = async (req, res, next) => {
  try {
    const yieldData = await Yield.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Yield record created successfully",
      data: yieldData,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateYield = async (req, res, next) => {
  try {
    const yieldData = await Yield.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!yieldData) {
      return res.status(404).json({
        success: false,
        message: "Yield record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Yield record updated successfully",
      data: yieldData,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteYield = async (req, res, next) => {
  try {
    const yieldData = await Yield.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!yieldData) {
      return res.status(404).json({
        success: false,
        message: "Yield record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Yield record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getCropSummary = async (req, res, next) => {
  try {
    const summary = await Yield.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$cropName",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$sellingPrice.totalPrice" },
          totalExpense: { $sum: "$totalExpense" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          cropName: "$_id",
          totalQuantity: 1,
          totalRevenue: 1,
          totalExpense: 1,
          profit: { $subtract: ["$totalRevenue", "$totalExpense"] },
          count: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
