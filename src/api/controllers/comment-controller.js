const httpStatus = require('http-status');
const Comment = require('../models/comment-model');

module.exports.update = async (req, res, next) => {
  const {
    params: { id },
    body: { text },
    user,
  } = req;
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: id, user },
      { text },
      { new: true },
    ).lean();
    if (!comment) {
      throw new Error('Không tìm thấy bình luận.');
    }
    return res.status(httpStatus.OK).json(comment);
  } catch (err) {
    next(err);
  }
};

module.exports.delete = async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: id, user },
      { deletedAt: new Date() },
    );
    if (!comment) {
      throw new Error('Không tìm thấy bình luận.');
    }
    return res.status(httpStatus.OK).json({
      message: 'Xoá bình luận thành công.',
    });
  } catch (err) {
    next(err);
  }
};
