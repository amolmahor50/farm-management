const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['task_reminder', 'emi_reminder', 'weather_alert', 'pest_alert', 'price_update', 'system', 'custom', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionUrl: String,
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['task', 'loan', 'expense', 'yield', 'other']
    },
    entityId: mongoose.Schema.Types.ObjectId
  },
  scheduledFor: Date,
  sentAt: Date,
  isSent: {
    type: Boolean,
    default: false
  },
  channels: [{
    type: String,
    enum: ['push', 'sms', 'email', 'in_app']
  }],
  metadata: mongoose.Schema.Types.Mixed,
  expiresAt: Date
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ scheduledFor: 1, isSent: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);
