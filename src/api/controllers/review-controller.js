const httpStatus = require('http-status');
const User = require('../models/user-model');
const Review = require('../models/review-model');
const Notification = require('../models/notification-model');

module.exports.create = async (req, res, next) => {
  const {
    user,
    body: { text, rating, tourGuideId },
  } = req;

  if (user._id.equals(tourGuideId)) {
    return res.status(httpStatus.FORBIDDEN).json({
      message: 'Bạn không thể tự đánh giá chính mình.',
    });
  }

  try {
    const tourGuide = await User.findById(tourGuideId);
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

    await Notification.create({
      user: tourGuide,
      text: `Bạn đã nhận được 1 nhận xét từ
       ${user.fullName.firstName} ${user.fullName.lastName}`,
    });

    const [{ reviewCount, avgRating }] = await Review.aggregate([
      { $match: { tourGuide: tourGuide._id, deletedAt: null } },
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

module.exports.update = async (req, res, next) => {
  const {
    user,
    params: { id },
  } = req;
  try {
    const review = await Review.findOneAndUpdate({ _id: id, user }, req.body, {
      new: true,
    }).lean();
    if (!review) {
      throw new Error('Không tìm thấy đánh giá.');
    }

    const [{ reviewCount, avgRating }] = await Review.aggregate([
      { $match: { tourGuide: review.tourGuide, deletedAt: null } },
      {
        $group: {
          _id: null,
          reviewCount: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    await User.updateOne(
      { _id: review.tourGuide },
      {
        'tourGuideProfile.rating': avgRating,
        'tourGuideProfile.reviewCount': reviewCount,
      },
    );

    return res.status(httpStatus.OK).json({
      message: 'Cập nhật thành công',
    });
  } catch (err) {
    next(err);
  }
};

module.exports.delete = async (req, res, next) => {
  const {
    user,
    params: { id },
  } = req;
  let reviewCount = 0;
  let avgRating = 0;
  try {
    const review = await Review.findOneAndUpdate(
      { _id: id, user },
      { deletedAt: new Date() },
    ).lean();

    if (!review) {
      throw new Error('Không tìm thấy đánh giá.');
    }

    const [reviewAggregated] = await Review.aggregate([
      { $match: { tourGuide: review.tourGuide, deletedAt: null } },
      {
        $group: {
          _id: null,
          reviewCount: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    if (reviewAggregated) {
      reviewCount = reviewAggregated.reviewCount;
      avgRating = reviewAggregated.avgRating;
    }

    await User.updateOne(
      { _id: review.tourGuide },
      {
        'tourGuideProfile.rating': avgRating,
        'tourGuideProfile.reviewCount': reviewCount,
      },
    );

    return res.status(httpStatus.OK).json({
      message: 'Đã xoá thành công.',
    });
  } catch (err) {
    next(err);
  }
};
