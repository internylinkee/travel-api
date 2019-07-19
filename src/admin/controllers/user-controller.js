const User = require('../../api/models/user-model');

exports.getList = async (req, res, next) => {
  const {
    query: { admin, tourGuide, q },
    skip,
    limit,
  } = req;

  const query = {
    role: admin ? 'admin' : 'user',
    isTourGuide: tourGuide,
    _id: { $ne: req.user._id },
  };

  if (q) {
    query.$or = [
      { 'fullName.firstName': { $regex: q, $options: 'i' } },
      { 'fullName.lastName': { $regex: q, $options: 'i' } },
    ];
  }

  try {
    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    await Promise.all([
      countCollection(users, Post, 'user', 'totalPost'),
      countCollection(users, Review, 'user', 'totalReview'),
    ]);

    return res.status(httpStatus.OK).json(users);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (req.user._id.equals(id)) {
      throw new Error('Không thể xoá tài khoản là chính bạn.');
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      { new: true },
    );

    if (!user) {
      throw new Error('Không tìm thấy user.');
    }

    return res.status(httpStatus.OK).json({
      message: 'Đã xoá thành công',
    });
  } catch (err) {
    next(err);
  }
};
