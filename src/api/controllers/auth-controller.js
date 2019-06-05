const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const User = require('../models/user-model');

module.exports.register = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUND),
    );

    await User.create({
      email,
      password: hashedPassword,
      fullName: {
        firstName,
        lastName,
      },
    });
    const { user, accessToken } = await User.findOneAndGenerateToken({
      email,
      password,
    });

    return res.status(httpStatus.CREATED).json({
      user,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};
