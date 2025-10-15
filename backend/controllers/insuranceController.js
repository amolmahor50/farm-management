const Insurance = require('../models/Insurance');

exports.getAllInsurances = async (req, res, next) => {
  try {
    const { status, insuranceType, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;
    if (insuranceType) query.insuranceType = insuranceType;

    const insurances = await Insurance.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Insurance.countDocuments(query);

    res.status(200).json({
      success: true,
      data: insurances,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

exports.getInsurance = async (req, res, next) => {
  try {
    const insurance = await Insurance.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance not found'
      });
    }

    res.status(200).json({
      success: true,
      data: insurance
    });
  } catch (error) {
    next(error);
  }
};

exports.createInsurance = async (req, res, next) => {
  try {
    const insurance = await Insurance.create({
      user: req.user.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Insurance created successfully',
      data: insurance
    });
  } catch (error) {
    next(error);
  }
};

exports.updateInsurance = async (req, res, next) => {
  try {
    const insurance = await Insurance.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Insurance updated successfully',
      data: insurance
    });
  } catch (error) {
    next(error);
  }
};

exports.fileClaim = async (req, res, next) => {
  try {
    const { incidentDate, incidentType, claimAmount, documents, remarks } = req.body;

    const insurance = await Insurance.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance not found'
      });
    }

    const claimNumber = `CLM${Date.now()}${Math.random().toString(36).substr(2, 5)}`;

    insurance.claims.push({
      claimNumber,
      claimDate: Date.now(),
      incidentDate,
      incidentType,
      claimAmount,
      status: 'submitted',
      documents,
      remarks
    });

    insurance.status = 'claimed';
    await insurance.save();

    res.status(201).json({
      success: true,
      message: 'Claim filed successfully',
      data: insurance
    });
  } catch (error) {
    next(error);
  }
};
