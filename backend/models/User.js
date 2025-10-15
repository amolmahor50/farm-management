const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    farmDetails: {
      farmName: String,
      farmSize: Number,
      location: {
        address: String,
        state: String,
        district: String,
        pincode: String,
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
      },
      soilType: String,
      mainCrops: [String],
    },
    profileImage: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpire: Date,
    role: {
      type: String,
      enum: ["farmer", "expert", "admin"],
      default: "farmer",
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium"],
        default: "free",
      },
      startDate: {
        type: Date,
        default: () => new Date(),
      },
      endDate: Date,
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    preferences: {
      language: {
        type: String,
        default: "en",
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
    deviceTokens: [String],
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

//  Hash password before save
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  //  Auto-deactivate free subscription after 3 days
  if (this.subscription?.plan === "free" && this.subscription.isActive) {
    const now = new Date();
    const start = this.subscription.startDate || this.createdAt;
    const diffDays = (now - start) / (1000 * 60 * 60 * 24); // difference in days

    if (diffDays >= 3) {
      this.subscription.isActive = false;
    }
  }

  next();
});

//  Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
