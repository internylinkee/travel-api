const httpStatus = require('http-status');
const User = require('../models/user-model');
const Notification = require('../models/notification-model');
const Post = require('../models/post-model');
const Review = require('../models/review-model');
const countCollection = require('../../utils/count-collection');

require('../models/location-model');

exports.getList = async (req, res, next) => {
  const {
    query: { q, sort },
    skip,
    limit,
  } = req;

  const query = { isTourGuide: true };
  const sortBy = {};
  if (q) {
    query.$or = [
      { 'fullName.firstName': { $regex: q, $options: 'i' } },
      { 'fullName.lastName': { $regex: q, $options: 'i' } },
    ];
  }

  switch (sort) {
    case 'like':
      sortBy.followers = -1;
    case 'review':
      sortBy['tourGuideProfile.reviewCount'] = -1;
    case 'post':
      sortBy.postCount = -1;
    default:
  }

  try {
    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortBy)
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

exports.get = async (req, res, next) => {
  const { _id } = req.user;
  let isFollow = false;

  try {
    const user = await User.findById(req.params.id)
      .populate('tourGuideProfile.location')
      .lean();

    if (!user) {
      throw new Error('User not found.');
    }

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
        dob,
        isMale,
        firstName,
        lastName,
        facebookUrl,
        phone,
        avatar,
        background,
        location,
        certificate,
        introduction,
      },
      params: { id },
      user: { _id: userId },
    } = req;

    if (!userId.equals(id)) {
      throw new Error('Bạn không thể cập nhật thông tin của người dùng khác.');
    }

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
      avatar: avatar || user.avatar,
      background: background || user.background,
      dob: dob || user.dob,
      isMale: isMale || user.isMale,
    });

    if (user.isTourGuide) {
      Object.assign(user.tourGuideProfile, {
        location: location || user.tourGuideProfile.location,
        certificate: certificate || user.tourGuideProfile.certificate,
        introduction: introduction || user.tourGuideProfile.introduction,
        languages: languages || user.tourGuideProfile.languages,
        expirence: expirence || user.tourGuideProfile.expirence,
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
    if (userId.equals(id)) {
      throw new Error('Bạn không thể tự follow chính mình.');
    }

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

exports.getHotUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ followers: -1 })
      .limit(5)
      .select('fullName avatar followers')
      .lean();
    await countCollection(users, Post, 'user', 'postCount');

    users.forEach(user => (user.followerCount = user.followers.length));

    return res.status(httpStatus.OK).json(users);
  } catch (err) {
    return next(err);
  }
};
