const httpStatus = require('http-status');
const Application = require('../models/appilication-model');
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
      ? { id: req.params.id }
      : { id: req.params.id, user: req.user };

  try {
    const application = await Application.findOne(query);

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
        'Bạn đã tạo đơn xin làm hướng dẫn viên, vui lòng chờ hệ thống xác nhận.'
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
