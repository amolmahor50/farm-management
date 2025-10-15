const Task = require('../models/Task');

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
      .skip((page - 1) * limit)
      .populate('cropAssociated', 'cropName');

    const count = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('cropAssociated');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      user: req.user.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.markComplete = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.status = 'completed';
    task.completedDate = Date.now();
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task marked as completed',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.getUpcomingTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      status: { $in: ['pending', 'in_progress'] },
      startDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    })
      .sort({ startDate: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};
