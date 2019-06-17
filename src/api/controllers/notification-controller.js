const httpStatus = require('http-status');
const Notification = require('../models/notification-model');

module.exports.getAll = async (req, res, next) => {
  const { user, skip, limit } = req;
  try {
    const notifications = await Notification.find({ user })
      .skip(skip)
      .limit(limit)
      .lean();

    const unreadQuantity = notifications.filter(item => item.isRead === false)
      .length;

    return res.status(httpStatus.OK).json({
      notifications,
      unreadQuantity,
    });
  } catch (err) {
    next(err);
  }
};
