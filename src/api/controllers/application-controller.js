const httpStatus = require('http-status');
const Application = require('../models/appilication-model');

module.exports.create = async (req, res, next) => {
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
