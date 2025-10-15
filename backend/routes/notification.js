const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllNotifications)
  .post(createNotification);

router.patch('/mark-all-read', markAllAsRead);

router.route('/:id')
  .delete(deleteNotification);

router.patch('/:id/read', markAsRead);

module.exports = router;
