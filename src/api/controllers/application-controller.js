const httpStatus = require('http-status');
const Application = require('../models/appilication-model');
const { STATUS_CANCEL } = require('../models/appilication-model');
const { ADMIN } = require('../models/user-model');

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
  const { user } = req;
  try {
    const isApplicationExist =
      (await Application.findOne({ user })
        .select('_id')
        .lean()) !== null;

    if (user.tourGuideProfile) {
      throw new Error(
        'Bạn đã là hướng dẫn viên nên không thể tạo thêm đăng ký.',
      );
    }

    if (isApplicationExist) {
      throw new Error(
        'Bạn đã tạo đơn xin làm hướng dẫn viên, vui lòng chờ hệ thống xác nhận.',
      );
    }

    const application = await Application.create({
      ...req.body,
      user: user._id,
    });

    return res.status(httpStatus.CREATED).json(application);
  } catch (err) {
    next(err);
  }
};
