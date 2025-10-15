const Expert = require('../models/Expert');

exports.getAllExperts = async (req, res, next) => {
  try {
    const { expertise, language, page = 1, limit = 10 } = req.query;

    const query = { isActive: true, isVerified: true };
    if (expertise) query.expertise = expertise;
    if (language) query.languages = language;

    const experts = await Expert.find(query)
      .populate('user', 'name phone email profileImage')
      .sort({ 'rating.average': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Expert.countDocuments(query);

    res.status(200).json({
      success: true,
      data: experts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

exports.getExpert = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id)
      .populate('user', 'name phone email profileImage');

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    res.status(200).json({
      success: true,
      data: expert
    });
  } catch (error) {
    next(error);
  }
};

exports.createExpertProfile = async (req, res, next) => {
  try {
    const existingExpert = await Expert.findOne({ user: req.user.id });

    if (existingExpert) {
      return res.status(400).json({
        success: false,
        message: 'Expert profile already exists'
      });
    }

    const expert = await Expert.create({
      user: req.user.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Expert profile created successfully',
      data: expert
    });
  } catch (error) {
    next(error);
  }
};

exports.bookConsultation = async (req, res, next) => {
  try {
    const { expertId, type, topic, date, duration } = req.body;

    const expert = await Expert.findById(expertId);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    const fee = expert.consultationFees[type] || 0;

    expert.consultations.push({
      farmer: req.user.id,
      type,
      topic,
      date,
      duration,
      status: 'scheduled',
      fee
    });

    expert.totalConsultations += 1;
    await expert.save();

    res.status(201).json({
      success: true,
      message: 'Consultation booked successfully',
      data: expert
    });
  } catch (error) {
    next(error);
  }
};

exports.rateExpert = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;

    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    const totalRating = expert.rating.average * expert.rating.count + rating;
    expert.rating.count += 1;
    expert.rating.average = totalRating / expert.rating.count;

    await expert.save();

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};
