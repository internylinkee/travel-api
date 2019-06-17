const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: String,
      minlength: 2,
      maxlength: 255,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    url: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  'Notification',
  notificationSchema,
  'notifications',
);
