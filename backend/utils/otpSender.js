const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (phone, otp) => {
  try {
    console.log(`Sending OTP ${otp} to ${phone}`);

    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

const verifyOTP = (userOTP, storedOTP, otpExpire) => {
  if (!storedOTP || !otpExpire) {
    return {
      success: false,
      message: "OTP not found or expired",
    };
  }

  if (Date.now() > otpExpire) {
    return {
      success: false,
      message: "OTP has expired",
    };
  }

  if (userOTP !== storedOTP) {
    return {
      success: false,
      message: "Invalid OTP",
    };
  }

  return {
    success: true,
    message: "OTP verified successfully",
  };
};

module.exports = {
  generateOTP,
  sendOTP,
  verifyOTP,
};

// const twilio = require("twilio");
// require("dotenv").config(); // Load environment variables from .env

// // Twilio credentials from .env file
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
// const messagingServiceSid = process.env.TWILIO_MESSAGING_SID; // Optional, recommended

// // Initialize Twilio client
// const client = twilio(accountSid, authToken);

// /**
//  * Generate a 6-digit OTP
//  */
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// /**
//  * ✅ Helper: Format phone number to E.164 format
//  * Ensures Twilio accepts the number (adds +91 for India if missing)
//  */
// const formatPhoneNumber = (phone) => {
//   // Remove all non-numeric characters
//   phone = phone.replace(/\D/g, "");

//   // Add default country code if missing (e.g. India)
//   if (!phone.startsWith("91") && phone.length === 10) {
//     phone = "91" + phone;
//   }

//   // Add '+' prefix if missing
//   if (!phone.startsWith("+")) {
//     phone = "+" + phone;
//   }

//   return phone;
// };

// /**
//  * 📤 Send OTP using Twilio SMS API
//  * Uses Messaging Service SID (if available) or fallback to Twilio phone number
//  */
// const sendOTP = async (phone, otp) => {
//   try {
//     const formattedPhone = formatPhoneNumber(phone);

//     const smsOptions = {
//       body: `Your verification code is: ${otp}`,
//       to: formattedPhone,
//     };

//     // Prefer Messaging Service SID (auto handles country restrictions)
//     if (messagingServiceSid) {
//       smsOptions.messagingServiceSid = messagingServiceSid;
//     } else {
//       smsOptions.from = twilioPhone;
//     }

//     const message = await client.messages.create(smsOptions);

//     console.log(
//       `✅ OTP ${otp} sent to ${formattedPhone}. Message SID: ${message.sid}`
//     );

//     return {
//       success: true,
//       message: "OTP sent successfully",
//       sid: message.sid,
//     };
//   } catch (error) {
//     console.error("❌ Error sending OTP:", error.message);
//     return {
//       success: false,
//       message: "Failed to send OTP",
//       error: error.message,
//     };
//   }
// };

// /**
//  * ✅ Verify OTP validity
//  */
// const verifyOTP = (userOTP, storedOTP, otpExpire) => {
//   if (!storedOTP || !otpExpire) {
//     return {
//       success: false,
//       message: "OTP not found or expired",
//     };
//   }

//   if (Date.now() > otpExpire) {
//     return {
//       success: false,
//       message: "OTP has expired",
//     };
//   }

//   if (userOTP !== storedOTP) {
//     return {
//       success: false,
//       message: "Invalid OTP",
//     };
//   }

//   return {
//     success: true,
//     message: "OTP verified successfully",
//   };
// };

// module.exports = {
//   generateOTP,
//   sendOTP,
//   verifyOTP,
// };
