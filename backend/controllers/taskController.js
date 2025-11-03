const Task = require("../models/Task");

// 🟢 Get All Tasks (with filters + pagination)
exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, taskType, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (taskType) query.taskType = taskType;

    const tasks = await Task.find(query)
      .sort({ startDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

// 🟢 Get Single Task by ID
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// 🟢 Create New Task
exports.createTask = async (req, res, next) => {
  try {
    let body = { ...req.body };

    // 🧩 Fix for empty recurringPattern frequency
    if (body.isRecurring && body.recurringPattern) {
      if (!body.recurringPattern.frequency) {
        body.recurringPattern.frequency = "daily"; // default fallback
      }
    } else {
      delete body.recurringPattern;
      body.isRecurring = false;
    }

    const task = await Task.create({
      user: req.user.id,
      ...body,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// 🟢 Update Task
exports.updateTask = async (req, res, next) => {
  try {
    let body = { ...req.body };

    // 🧩 Prevent validation errors for recurring pattern
    if (body.isRecurring && body.recurringPattern) {
      if (!body.recurringPattern.frequency) {
        body.recurringPattern.frequency = "daily";
      }
    } else {
      delete body.recurringPattern;
      body.isRecurring = false;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// 🟢 Delete Task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// 🟢 Mark Task as Completed
exports.markComplete = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status = "completed";
    task.completedDate = new Date();
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task marked as completed",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// 🟢 Get Upcoming Tasks (next 7 days)
exports.getUpcomingTasks = async (req, res, next) => {
  try {
    const now = new Date();
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      user: req.user.id,
      status: { $in: ["pending", "in_progress"] },
      startDate: { $gte: now, $lte: nextWeek },
    })
      .sort({ startDate: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};
