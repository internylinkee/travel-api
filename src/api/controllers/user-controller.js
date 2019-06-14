const httpStatus = require('http-status');
const User = require('../models/user-model');
const Notification = require('../models/notification-model');
const Review = require('../models/review-model');

module.exports.get = async (req, res, next) => {
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

module.exports.update = async (req, res, next) => {
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

module.exports.follow = async (req, res, next) => {
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

module.exports.review = async (req, res, next) => {
  const {
    user,
    params: { id },
    body: { text, rating },
  } = req;
  try {
    const tourGuide = await User.findById(id);
    if (!tourGuide.isTourGuide) {
      throw new Error(
        'Bạn không thể đánh giá user mà không phải là hướng dẫn viên.',
      );
    }

    const isExistreview = await Review.findOne({ user, tourGuide })
      .select('_id')
      .lean();
    if (isExistreview) {
      throw new Error('Bạn đã đánh giá về hướng dẫn viên này.');
    }

    const review = await Review.create({
      user,
      text,
      rating,
      tourGuide,
    });

    const [{ reviewCount, avgRating }] = await Review.aggregate([
      { $match: { tourGuide: tourGuide._id } },
      {
        $group: {
          _id: null,
          reviewCount: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    tourGuide.tourGuideProfile.rating = avgRating;
    tourGuide.tourGuideProfile.reviewCount = reviewCount;
    await tourGuide.save();

    return res.status(httpStatus.CREATED).json(review);
  } catch (err) {
    next(err);
  }
};
