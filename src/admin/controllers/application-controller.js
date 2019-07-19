const httpStatus = require('http-status');
const Application = require('../../api/models/appilication-model');
const Notification = require('../../api/models/notification-model');
const {
  STATUS_CANCEL,
  STATUS_CONFIRMED,
} = require('../../api/models/appilication-model');

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
  try {
    const application = await Application.findById(req.params.id)
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

exports.confirm = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      throw new Error('Không tìm thấy đơn yêu cầu.');
    }

    if (application.status === STATUS_CANCEL) {
      throw new Error('Không thể xác nhận đơn yêu cầu đã bị huỷ.');
    }

    if (application.status === STATUS_CONFIRMED) {
      throw new Error('Bạn đã xác nhận đơn yêu cầu này.');
    }

    application.status = STATUS_CONFIRMED;
    await application.save();

    await Notification.create({
      user: application.user,
      text: 'Ban quản trị đã xác nhận đơn yêu cầu của bạn.',
    });

    return res.status(httpStatus.OK).json({
      message: 'Đã xác nhận thành công.',
    });
  } catch (err) {
    next(err);
  }
};
