const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTP, verifyOTP } = require("../utils/otpSender");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.sendLoginOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required" });

    const otp = generateOTP();
    const otpExpire = Date.now() + parseInt(process.env.OTP_EXPIRE) * 60 * 1000;

    let user = await User.findOne({ phone });

    if (!user) {
      // New user → temporary record
      user = await User.create({
        phone,
        otp,
        otpExpire,
        isVerified: false,
      });
      await sendOTP(phone, otp);
      return res.status(201).json({
        success: true,
        message: "OTP sent for registration",
        newUser: true,
        expiresIn: process.env.OTP_EXPIRE,
      });
    }

    // Existing user → login OTP
    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    await sendOTP(phone, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent for login",
      newUser: false,
      expiresIn: process.env.OTP_EXPIRE,
    });
  } catch (error) {
    console.error("sendLoginOTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// ---------------- VERIFY LOGIN OTP ----------------
exports.verifyLoginOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Phone and OTP required" });

    const user = await User.findOne({ phone });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const verification = verifyOTP(otp, user.otp, user.otpExpire);
    if (!verification.success) return res.status(400).json(verification);

    user.otp = undefined;
    user.otpExpire = undefined;
    user.isVerified = true;
    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user,
      newUser: !user.name, // if no name → show UserDetails form
    });
  } catch (error) {
    console.error("verifyLoginOTP error:", error);
    res
      .status(500)
      .json({ success: false, message: "OTP verification failed" });
  }
};

// ---------------- REGISTER / SAVE USER DETAILS ----------------
exports.register = async (req, res) => {
  try {
    const { phone, name, email } = req.body;

    if (!phone || !name)
      return res
        .status(400)
        .json({ success: false, message: "Phone and name required" });

    // Update existing temporary user
    const user = await User.findOne({ phone });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.name = name;
    user.email = email;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "User details saved successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("register error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to save user details" });
  }
};

// exports.verifyRegistration = async (req, res, next) => {
//   try {
//     const { phone, otp } = req.body;

//     if (!phone || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone number and OTP are required",
//       });
//     }

//     const user = await User.findOne({ phone });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const verification = verifyOTP(otp, user.otp, user.otpExpire);

//     if (!verification.success) {
//       return res.status(400).json(verification);
//     }

//     user.otp = undefined;
//     user.otpExpire = undefined;
//     user.isVerified = true;
//     await user.save();

//     const token = generateToken(user._id);

//     res.status(200).json({
//       success: true,
//       message: "Account verified successfully",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         phone: user.phone,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

// ---------------- CHECK USER EXISTS ----------------
exports.checkUserExists = async (req, res) => {
  const { phone } = req.params;
  const user = await User.findOne({ phone });
  res.status(200).json({
    success: true,
    exists: !!user,
    isVerified: user?.isVerified || false,
  });
};
