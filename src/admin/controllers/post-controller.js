const httpStatus = require('http-status');
const Post = require('../../api/models/post-model');

exports.delete = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  try {
    const post = await Post.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    }).lean();

    if (!post) {
      throw new Error('Không tìm thấy bài viết.');
    }

    return res.status(httpStatus.OK).json({
      message: 'Xoá bài viết thành công.',
    });
  } catch (err) {
    next(err);
  }
};
