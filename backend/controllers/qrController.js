const QRData = require('../models/QRData');
const QRCode = require('qrcode');

exports.getAllQRData = async (req, res, next) => {
  try {
    const { itemType, status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (itemType) query.itemType = itemType;
    if (status) query.status = status;

    const qrData = await QRData.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await QRData.countDocuments(query);

    res.status(200).json({
      success: true,
      data: qrData,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

exports.getQRData = async (req, res, next) => {
  try {
    const qrData = await QRData.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!qrData) {
      return res.status(404).json({
        success: false,
        message: 'QR data not found'
      });
    }

    res.status(200).json({
      success: true,
      data: qrData
    });
  } catch (error) {
    next(error);
  }
};

exports.createQRData = async (req, res, next) => {
  try {
    const qrCode = `QR${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    const qrData = await QRData.create({
      user: req.user.id,
      qrCode,
      ...req.body
    });

    const qrImageUrl = await QRCode.toDataURL(qrCode);

    res.status(201).json({
      success: true,
      message: 'QR data created successfully',
      data: { ...qrData.toObject(), qrImageUrl }
    });
  } catch (error) {
    next(error);
  }
};

exports.scanQRCode = async (req, res, next) => {
  try {
    const { qrCode } = req.body;

    const qrData = await QRData.findOne({ qrCode });

    if (!qrData) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found'
      });
    }

    res.status(200).json({
      success: true,
      data: qrData
    });
  } catch (error) {
    next(error);
  }
};

exports.recordUsage = async (req, res, next) => {
  try {
    const { quantityUsed, cropApplied, purpose, notes } = req.body;

    const qrData = await QRData.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!qrData) {
      return res.status(404).json({
        success: false,
        message: 'QR data not found'
      });
    }

    qrData.usageHistory.push({
      date: Date.now(),
      quantityUsed,
      cropApplied,
      purpose,
      notes
    });

    if (qrData.storage.currentStock) {
      qrData.storage.currentStock -= quantityUsed;
      if (qrData.storage.currentStock <= 0) {
        qrData.status = 'depleted';
      }
    }

    await qrData.save();

    res.status(200).json({
      success: true,
      message: 'Usage recorded successfully',
      data: qrData
    });
  } catch (error) {
    next(error);
  }
};
