const User = require('../models/user-model');

module.exports.create = async (req, res, next) => {
  const user = await User.findById('5cf624afdad76d11bc4242dd').populate({
    path: 'followers',
  });
  // const newUser = new User({
  //   fullName: {
  //     firstName: 'aaaaa',
  //   },
  // });
  // await newUser.save();
  console.log(req.body);

  res.json(user);
};
