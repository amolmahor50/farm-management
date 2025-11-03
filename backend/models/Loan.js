const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Loan Type
    loanType: {
      type: String,
      required: true,
      enum: [
        "crop_loan",
        "equipment_loan",
        "land_loan",
        "personal_loan",
        "micro_loan",
        "other",
      ],
    },

    // Lender Details
    lender: {
      name: { type: String, required: true },
      type: {
        type: String,
        enum: [
          "bank",
          "cooperative",
          "private_lender",
          "government",
          "ngo",
          "other",
        ],
      },
      phone: String,
      address: String,
    },

    // Financials
    principal: { type: Number, required: true, min: 0 },
    interestRate: { type: Number, required: true, min: 0 },
    interestType: {
      type: String,
      enum: ["simple", "compound"],
      default: "simple",
    },
    tenure: { months: { type: Number, required: true } },
    emiAmount: { type: Number, required: true },

    startDate: { type: Date, required: true },
    endDate: Date,
    disbursementDate: Date,
    purpose: String,

    // Computed fields
    totalAmount: Number, // principal + total interest
    totalPaid: { type: Number, default: 0 },
    remainingAmount: Number,

    // Status
    status: {
      type: String,
      enum: ["pending", "active", "completed", "defaulted", "closed"],
      default: "pending",
    },

    // EMI Schedule
    emiSchedule: [
      {
        emiNumber: Number,
        dueDate: Date,
        amount: Number,
        principal: Number,
        interest: Number,
        isPaid: { type: Boolean, default: false },
        paidDate: Date,
        paidAmount: Number,
        lateFee: Number,
      },
    ],

    // Documents
    documents: [
      {
        name: String,
        url: String,
        uploadDate: Date,
      },
    ],

    // Collateral & Guarantor
    collateral: { type: String, description: String },
    guarantor: { name: String, phone: String, relation: String },

    // Notes
    notes: String,

    // Reminders
    reminders: {
      enabled: { type: Boolean, default: true },
      daysBefore: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Indexes
loanSchema.index({ user: 1, status: 1 });
loanSchema.index({ "emiSchedule.dueDate": 1 });

/**
 * Pre-save Hook: Auto-calculate totals, EMI schedule, and reminders
 */
loanSchema.pre("save", function (next) {
  let totalInterest = 0;
  if (this.interestType === "simple") {
    totalInterest =
      (this.principal * this.interestRate * this.tenure.months) / (100 * 12);
  } else if (this.interestType === "compound") {
    const rate = this.interestRate / 100 / 12;
    totalInterest =
      this.principal * (Math.pow(1 + rate, this.tenure.months) - 1);
  }

  this.totalAmount = this.principal + totalInterest;
  this.remainingAmount = this.totalAmount - (this.totalPaid || 0);

  if (this.startDate && this.tenure?.months && !this.endDate) {
    const calculatedEnd = new Date(this.startDate);
    calculatedEnd.setMonth(calculatedEnd.getMonth() + this.tenure.months);
    this.endDate = calculatedEnd;
  }

  if (!this.emiSchedule || this.emiSchedule.length === 0) {
    const emiPrincipal = this.principal / this.tenure.months;
    const emiInterest = totalInterest / this.tenure.months;

    const schedule = [];
    for (let i = 0; i < this.tenure.months; i++) {
      const dueDate = new Date(this.startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      schedule.push({
        emiNumber: i + 1,
        dueDate,
        amount: emiPrincipal + emiInterest,
        principal: emiPrincipal,
        interest: emiInterest,
      });
    }
    this.emiSchedule = schedule;
  }

  if (this.reminders.enabled && this.emiSchedule?.length > 0) {
    const today = new Date();
    const nextEmi = this.emiSchedule.find(
      (emi) => !emi.isPaid && emi.dueDate >= today
    );
    this.reminders.daysBefore = nextEmi
      ? Math.ceil((nextEmi.dueDate - today) / (1000 * 60 * 60 * 24))
      : 0;
  }

  if (["completed", "closed"].includes(this.status)) {
    this.totalPaid = this.totalAmount;
    this.remainingAmount = 0;
    this.endDate = new Date();
    if (Array.isArray(this.emiSchedule)) {
      this.emiSchedule = this.emiSchedule.map((emi) => ({
        ...emi,
        isPaid: true,
        paidAmount: emi.amount,
        paidDate: emi.paidDate || new Date(),
      }));
    }
  }

  next();
});

/**
 * Pre-update Hook: Recalculate totals, EMI schedule, and reminders
 * when tenure, principal, interestRate, or startDate changes
 */
loanSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (!update) return next();

  const recalcFields = [
    "tenure.months",
    "principal",
    "interestRate",
    "startDate",
  ];
  const shouldRecalc =
    recalcFields.some((f) => f in update) ||
    (update.$set && recalcFields.some((f) => f in update.$set));
  if (!shouldRecalc) return next();

  const docToUpdate = await this.model.findOne(this.getQuery());
  if (!docToUpdate) return next();

  const newDoc = { ...docToUpdate.toObject(), ...(update.$set || update) };

  let totalInterest = 0;
  if (newDoc.interestType === "simple") {
    totalInterest =
      (newDoc.principal * newDoc.interestRate * newDoc.tenure.months) /
      (100 * 12);
  } else if (newDoc.interestType === "compound") {
    const rate = newDoc.interestRate / 100 / 12;
    totalInterest =
      newDoc.principal * (Math.pow(1 + rate, newDoc.tenure.months) - 1);
  }

  newDoc.totalAmount = newDoc.principal + totalInterest;
  newDoc.remainingAmount = newDoc.totalAmount - (newDoc.totalPaid || 0);

  if (newDoc.startDate && newDoc.tenure?.months) {
    const calculatedEnd = new Date(newDoc.startDate);
    calculatedEnd.setMonth(calculatedEnd.getMonth() + newDoc.tenure.months);
    newDoc.endDate = calculatedEnd;
  }

  const emiPrincipal = newDoc.principal / newDoc.tenure.months;
  const emiInterest = totalInterest / newDoc.tenure.months;

  const schedule = [];
  for (let i = 0; i < newDoc.tenure.months; i++) {
    const dueDate = new Date(newDoc.startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    schedule.push({
      emiNumber: i + 1,
      dueDate,
      amount: emiPrincipal + emiInterest,
      principal: emiPrincipal,
      interest: emiInterest,
      isPaid: i < (newDoc.paidEmis || 0),
      paidAmount: i < (newDoc.paidEmis || 0) ? emiPrincipal + emiInterest : 0,
    });
  }

  update.$set = {
    ...update.$set,
    totalAmount: newDoc.totalAmount,
    remainingAmount: newDoc.remainingAmount,
    endDate: newDoc.endDate,
    emiSchedule: schedule,
  };

  if (newDoc.reminders.enabled) {
    const today = new Date();
    const nextEmi = schedule.find((emi) => !emi.isPaid && emi.dueDate >= today);
    update.$set.reminders = {
      ...newDoc.reminders,
      daysBefore: nextEmi
        ? Math.ceil((nextEmi.dueDate - today) / (1000 * 60 * 60 * 24))
        : 0,
    };
  }

  next();
});

/**
 * Post-update Hook: Handle completed or closed loans
 */
loanSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;

  if (["completed", "closed"].includes(doc.status)) {
    doc.remainingAmount = 0;
    doc.totalPaid = doc.totalAmount;
    doc.endDate = new Date();

    if (Array.isArray(doc.emiSchedule)) {
      doc.emiSchedule = doc.emiSchedule.map((emi) => ({
        ...emi,
        isPaid: true,
        paidAmount: emi.amount,
        paidDate: emi.paidDate || new Date(),
      }));
    }

    // Update dynamic reminders
    if (doc.reminders.enabled && doc.emiSchedule?.length > 0) {
      const today = new Date();
      const nextEmi = doc.emiSchedule.find(
        (emi) => !emi.isPaid && emi.dueDate >= today
      );
      doc.reminders.daysBefore = nextEmi
        ? Math.ceil((nextEmi.dueDate - today) / (1000 * 60 * 60 * 24))
        : 0;
    }

    await doc.save();
  }
});

module.exports = mongoose.model("Loan", loanSchema);
