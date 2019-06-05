const httpStatus = require('http-status');
const User = require('../models/user-model');

module.exports.get = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error('User not found.');
    }
    return res.status(httpStatus.OK).json(user);
  } catch (err) {
    next(err);
  }
};
