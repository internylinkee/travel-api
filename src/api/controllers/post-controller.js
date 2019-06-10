const httpStatus = require('http-status');
const Post = require('../models/post-model');
const cloudinary = require('../../config/cloudinary');

module.exports.getList = async (req, res, next) => {
  const {
    body: { location, category },
    limit,
    skip,
  } = req;

  const posts = [];
  try {
    if (!location && !category) {
      posts.push(
        await Post.find()
          .skip(skip)
          .limit(limit)
          .sort({ likes: -1 })
          .lean(),
      );
    } else if (location && category) {
      posts.push(
        await Post.find({
          locations: { $in: location },
          categories: { $in: category },
        })
          .skip(skip)
          .limit(limit)
          .sort({ likes: -1 })
          .lean(),
      );
    } else if (location) {
      posts.push(
        await Post.find({
          locations: { $in: location },
        })
          .skip(skip)
          .limit(limit)
          .sort({ likes: -1 })
          .lean(),
      );
    } else {
      posts.push(
        await Post.find({
          categories: { $in: category },
        })
          .skip(skip)
          .limit(limit)
          .sort({ likes: -1 })
          .lean(),
      );
    }

    return res.json(posts);
  } catch (err) {
    next(err);
  }
};

module.exports.get = async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;
  let isLike = false;
  try {
    const post = await Post.findById(id);
    if (!post) {
      throw new Error('Không tìm thấy bài viết.');
    }
    for (let liker of post.likes) {
      if (liker.equals(user._id)) {
        isLike = true;
        break;
      }
    }

    return res.status(httpStatus.OK).json({
      post,
      isLike,
    });
  } catch (err) {
    next(err);
  }
};

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

module.exports.update = async (req, res, next) => {
  const {
    user,
    body: { title, content, locations, categories, type },
    params: { id },
  } = req;
  try {
    const post = await Post.findOne({ _id: id, user });
    if (!post) {
      throw new Error('Không tìm thấy bài viết.');
    }

    Object.assign(post, {
      title: title || post.title,
      content: content || post.content,
      locations: locations || post.locations,
      categories: categories || post.categories,
      type: type || post.type,
    });
    await post.save();

    return res.status(httpStatus.OK).json(post);
  } catch (err) {
    next(err);
  }
};

module.exports.like = async (req, res, next) => {
  const {
    params: { id },
    user: { _id: userId },
  } = req;
  let isLike = false;
  let uploadedPost;
  try {
    const post = await Post.findById(id)
      .select('likes')
      .lean();
    if (!post) {
      throw new Error('Không tìm thấy bài viết.');
    }

    for (let liker of post.likes) {
      if (liker.equals(userId)) {
        isLike = true;
        break;
      }
    }
    if (isLike) {
      uploadedPost = await Post.findOneAndUpdate(
        { _id: id },
        { $pull: { likes: userId } },
        { new: true },
      );
    } else {
      uploadedPost = await Post.findOneAndUpdate(
        { _id: id },
        { $push: { likes: userId } },
        { new: true },
      );
    }

    return res.status(httpStatus.OK).json({
      likeCount: uploadedPost.likes.length,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deletePost = async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;
  try {
    const post = await Post.findOneAndUpdate(
      { _id: id, user },
      { deletedAt: new Date() },
    ).lean();
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
