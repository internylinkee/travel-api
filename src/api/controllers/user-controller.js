const httpStatus = require('http-status');
const User = require('../models/user-model');
const Notification = require('../models/notification-model');

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

    return res.status(httpStatus.OK).json(users);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      throw new Error('User not found.');
    }

    let isFollow = false;

    for (let _user of user.followers) {
      if (_user._id.equals(_id)) {
        isFollow = true;
      }
    }
    return res.status(httpStatus.OK).json({
      user,
      isFollow,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const {
      body: {
        firstName,
        lastName,
        facebookUrl,
        phone,
        location,
        certificate,
        introduction,
      },
      params: { id },
    } = req;

    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }

    Object.assign(user, {
      fullName: {
        firstName: firstName || user.fullName.firstName,
        lastName: lastName || user.fullName.lastName,
      },
      facebookUrl: facebookUrl || user.facebookUrl,
      phone: phone || user.phone,
    });

    if (user.isTourGuide) {
      Object.assign(user.tourGuideProfile, {
        location: location || user.tourGuideProfile.location,
        certificate: certificate || user.tourGuideProfile.certificate,
        introduction: introduction || user.tourGuideProfile.introduction,
      });
    }

    await user.save();

    return res.status(httpStatus.OK).json(user);
  } catch (err) {
    next(err);
  }
};

exports.follow = async (req, res, next) => {
  const {
    params: { id },
    user: {
      _id: userId,
      fullName: { firstName, lastName },
    },
  } = req;
  let isFollow = false;
  let updatedUser;

  try {
    const user = await User.findById(id).lean();
    if (!user) {
      throw new Error('User not found.');
    }

    for (let _user of user.followers) {
      if (_user._id.equals(userId)) {
        isFollow = true;
        break;
      }
    }

    if (!isFollow) {
      updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $push: { followers: userId },
        },
        { new: true },
      )
        .select('followers')
        .lean();
      await Notification.create({
        user: id,
        text: `${firstName} ${lastName} đã follow bạn.`,
      });
    }
    if (isFollow) {
      updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $pull: { followers: userId },
        },
        { new: true },
      )
        .select('followers')
        .lean();
    }

    return res.status(httpStatus.OK).json({
      likeCount: updatedUser.followers.length,
    });
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
