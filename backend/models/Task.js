const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    description: String,

    taskType: {
      type: String,
      enum: [
        "planting",
        "irrigation",
        "fertilization",
        "pesticide",
        "weeding",
        "harvesting",
        "pruning",
        "maintenance",
        "other",
      ],
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled", "overdue"],
      default: "pending",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: Date,
    dueDate: Date,
    completedDate: Date,

    // ✅ Re-added and fixed crop association (no populate error)
    cropAssociated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop", // Make sure you have a Crop model defined
      required: false,
    },

    location: {
      field: String,
      area: String,
    },

    // ✅ Assigned user info (manual entry)
    assignedTo: [
      {
        name: { type: String, trim: true },
        phone: { type: String, trim: true },
        role: { type: String, trim: true },
      },
    ],

    // ✅ Cost and duration
    estimatedCost: {
      type: Number,
      default: 0,
    },
    actualCost: {
      type: Number,
      default: 0,
    },

    estimatedDuration: {
      value: {
        type: Number,
        default: 0,
      },
      unit: {
        type: String,
        enum: ["hours", "days", "weeks"],
        default: "days",
      },
    },

    // ✅ Recurring pattern (with safe default values)
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "seasonal"],
      },
      interval: {
        type: Number,
        default: 1,
      },
      endAfter: {
        type: Date,
      },
    },

    reminders: [
      {
        time: Date,
        sent: {
          type: Boolean,
          default: false,
        },
      },
    ],

    checkList: [
      {
        item: String,
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],

    attachments: [
      {
        url: String,
        name: String,
        type: String,
      },
    ],

    weatherDependent: {
      type: Boolean,
      default: false,
    },

    notes: String,
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// ✅ Indexes
taskSchema.index({ user: 1, startDate: -1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

// ✅ Auto-update overdue status
taskSchema.pre("save", function (next) {
  if (this.dueDate && this.dueDate < new Date() && this.status === "pending") {
    this.status = "overdue";
  }

  // Prevent invalid recurring pattern frequency errors
  if (this.isRecurring && !this.recurringPattern.frequency) {
    this.recurringPattern.frequency = "daily";
  }

  next();
});

module.exports = mongoose.model("Task", taskSchema);
