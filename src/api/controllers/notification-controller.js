const httpStatus = require('http-status');
const Notification = require('../models/notification-model');

exports.getAll = async (req, res, next) => {
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

exports.countUnread = async (req, res, next) => {
  try {
    const unreadQuantity = await Notification.count({
      user: req.user,
      isRead: false,
    });

    return res.status(httpStatus.OK).json({
      unreadQuantity,
    });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  const {
    user,
    params: { id },
  } = req;
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      throw new Error('Không tìm thấy thông báo.');
    }

    return res.status(httpStatus.OK).json(notification);
  } catch (err) {
    next(err);
  }
};
