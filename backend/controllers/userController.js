const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      farmDetails: req.body.farmDetails,
      profileImage: req.body.profileImage,
      preferences: req.body.preferences
    };

    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.updateDeviceToken = async (req, res, next) => {
  try {
    const { deviceToken } = req.body;

    const user = await User.findById(req.user.id);

    if (!user.deviceTokens.includes(deviceToken)) {
      user.deviceTokens.push(deviceToken);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Device token updated'
    });
  } catch (error) {
    next(error);
  }
};

exports.removeDeviceToken = async (req, res, next) => {
  try {
    const { deviceToken } = req.body;

    const user = await User.findById(req.user.id);
    user.deviceTokens = user.deviceTokens.filter(token => token !== deviceToken);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Device token removed'
    });
  } catch (error) {
    next(error);
  }
};
