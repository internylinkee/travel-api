const httpStatus = require('http-status');
const Application = require('../models/appilication-model');
const Notification = require('../models/notification-model');
const {
  STATUS_PENDING,
  STATUS_CONFIRMED,
  STATUS_CANCEL,
} = require('../models/appilication-model');
const { ADMIN } = require('../models/user-model');

exports.getList = async (req, res, next) => {
  const {
    query: { q },
    skip,
    limit,
  } = req;

  const query = {};
  if (q) {
    query.status = q;
  }

  try {
    const applications = await Application.find(query)
      .populate('user location')
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(httpStatus.OK).json(applications);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  const query =
    req.user.role === ADMIN
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user, status: { $ne: STATUS_CANCEL } };

  try {
    const application = await Application.findOne(query)
      .populate('user location')
      .lean();

    return application
      ? res.status(httpStatus.OK).json(application)
      : res
          .status(httpStatus.NOT_FOUND)
          .json({ message: 'Không tìm thấy đơn yêu cầu.' });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const isApplicationExist =
      (await Application.findOne({ user: req.user })
        .select('_id')
        .lean()) !== null;

    if (isApplicationExist) {
      throw new Error(
        'Bạn đã tạo đơn xin làm hướng dẫn viên, vui lòng chờ hệ thống xác nhận.',
      );
    }

    const application = await Application.create({
      ...req.body,
      user: req.user._id,
    });

    return res.status(httpStatus.CREATED).json(application);
  } catch (err) {
    next(err);
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      throw new Error('Không tìm thấy đơn yêu cầu.');
    }

    if (application.status === STATUS_CANCEL) {
      throw new Error('Bạn đã huỷ đơn yêu cầu.');
    }

    if (application.status === STATUS_CONFIRMED) {
      throw new Error('Bạn không thể huỷ đơn yêu cầu đã được xác nhận.');
    }

    application.status = STATUS_CANCEL;
    await application.save();

    await Notification.create({
      user: application.user,
      text: 'Ban quản trị đã huỷ đơn yêu cầu của bạn vì không hợp lệ.',
    });

    return res.status(httpStatus.OK).json({
      message: 'Đã huỷ thành công.',
    });
  } catch (err) {
    next(err);
  }
};
