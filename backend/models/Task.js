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
    cropAssociated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Yield",
    },
    location: {
      field: String,
      area: String,
    },
    assignedTo: [
      {
        name: String,
        phone: String,
        role: String,
      },
    ],
    estimatedCost: Number,
    actualCost: Number,
    estimatedDuration: {
      value: Number,
      unit: {
        type: String,
        enum: ["hours", "days", "weeks"],
      },
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "seasonal"],
      },
      interval: Number,
      endAfter: Date,
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

taskSchema.index({ user: 1, startDate: -1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

taskSchema.pre("save", function (next) {
  if (this.dueDate && this.dueDate < new Date() && this.status === "pending") {
    this.status = "overdue";
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);
