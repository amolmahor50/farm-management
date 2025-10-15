const express = require("express");
const router = express.Router();
const {
  register,
  // verifyRegistration,
  sendLoginOTP,
  verifyLoginOTP,
  logout,
  getMe,
  checkUserExists,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
// router.post("/verify-registration", verifyRegistration);
router.post("/send-otp", sendLoginOTP);
router.post("/verify-otp", verifyLoginOTP);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.get("/check/:phone", checkUserExists);

module.exports = router;
