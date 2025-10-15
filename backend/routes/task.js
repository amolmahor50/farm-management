const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  markComplete,
  getUpcomingTasks
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllTasks)
  .post(createTask);

router.get('/upcoming', getUpcomingTasks);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/complete', markComplete);

module.exports = router;
