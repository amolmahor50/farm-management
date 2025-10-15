const Market = require('../models/Market');
const axios = require('axios');

exports.getCropPrices = async (req, res, next) => {
  try {
    const { cropName, state, district } = req.query;

    const query = {};
    if (cropName) query.cropName = new RegExp(cropName, 'i');
    if (state) query['market.location.state'] = state;
    if (district) query['market.location.district'] = district;

    const prices = await Market.find(query).sort({ date: -1 }).limit(50);

    res.status(200).json({
      success: true,
      data: prices
    });
  } catch (error) {
    next(error);
  }
};

exports.addCropPrice = async (req, res, next) => {
  try {
    const price = await Market.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Crop price added successfully',
      data: price
    });
  } catch (error) {
    next(error);
  }
};

exports.getPriceTrends = async (req, res, next) => {
  try {
    const { cropName } = req.params;

    const trends = await Market.aggregate([
      { $match: { cropName: new RegExp(cropName, 'i') } },
      { $sort: { date: -1 } },
      { $limit: 30 },
      {
        $project: {
          date: 1,
          price: '$priceData.modalPrice',
          market: '$market.name'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    next(error);
  }
};

exports.getSuppliers = async (req, res, next) => {
  try {
    const { productType, location } = req.query;

    const query = {};
    if (productType) query['suppliers.productType'] = productType;
    if (location) query['suppliers.location'] = new RegExp(location, 'i');

    const markets = await Market.find(query).select('suppliers');

    const suppliers = markets.flatMap(m => m.suppliers);

    res.status(200).json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    next(error);
  }
};
