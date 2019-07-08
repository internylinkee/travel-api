const Category = require('../models/category-model');

exports.getList = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .select('name')
      .lean();

    return res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};
