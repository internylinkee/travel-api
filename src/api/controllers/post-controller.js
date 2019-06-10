const httpStatus = require('http-status');
const Post = require('../models/post-model');
const cloudinary = require('../../config/cloudinary');

module.exports.create = async (req, res, next) => {
  const { files, user } = req;
  try {
    const fileUploaded = await Promise.all(
      files.map(({ path }) =>
        cloudinary.uploader.upload(path, { transformation: [{ width: 1000 }] }),
      ),
    );

    const urlFileUploaded = fileUploaded.map(file => file.secure_url);

    const post = await Post.create({
      ...req.body,
      user,
      featureImage: urlFileUploaded[0],
      images: urlFileUploaded,
    });

    return res.status(httpStatus.CREATED).json(post);
  } catch (err) {
    next(err);
  }
};
