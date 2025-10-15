const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "seeds",
        "fertilizer",
        "pesticide",
        "labor",
        "irrigation",
        "equipment",
        "transport",
        "electricity",
        "rent",
        "other",
      ],
    },
    subCategory: String,
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    cropAssociated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Yield",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "bank_transfer", "loan", "other"],
      default: "cash",
    },
    vendor: {
      name: String,
      phone: String,
      address: String,
    },
    receipt: {
      url: String,
      fileName: String,
    },
    quantity: Number,
    unit: String,
    notes: String,
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
