const Location = require('../models/location-model');

exports.getList = async (req, res, next) => {
  try {
    const locations = await Location.find()
      .select('name')
      .lean();
    return res.status(200).json(locations);
  } catch (err) {
    next(err);
  }
};
