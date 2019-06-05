const httpStatus = require('http-status');
const User = require('../models/user-model');

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
