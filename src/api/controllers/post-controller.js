const httpStatus = require('http-status');
const Post = require('../models/post-model');
const Comment = require('../models/comment-model');
const Notification = require('../models/notification-model');
const countCollection = require('../../utils/count-collection');
const cloudinary = require('../../config/cloudinary');
require('../models/category-model');

exports.getList = async (req, res, next) => {
  const query = {};
  let posts;

  const {
    query: { q, location, category, user },
    limit,
    skip,
  } = req;

  user ? (query.user = user) : '';
  q
    ? (query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ])
    : '';

  async function findPost(query) {
    return await Post.find(query)
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: 'user',
          select: 'fullName avatar',
        },
        'categories',
        'locations',
      ])
      .sort({ likes: -1, createdAt: -1 })
      .lean();
  }

  try {
    if (!location && !category) {
      posts = await findPost(query);
    } else if (location && category) {
      posts = await findPost({
        $and: [
          { locations: { $in: location } },
          { categories: { $in: category } },
          query,
        ],
      });
    } else if (location) {
      posts = await findPost({
        $and: [{ locations: { $in: location } }, query],
      });
    } else {
      posts = await findPost({
        $and: [{ categories: { $in: category } }, query],
      });
    }

    await countCollection(posts, Comment, 'post', 'commentCount');

    return res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;
  let isLike = false;

  try {
    const post = await Post.findById(id)
      .populate('categories locations user')
      .lean();

    if (!post) {
      throw new Error('Không tìm thấy bài viết.');
    }

    if (user) {
      for (let liker of post.likes) {
        if (liker.equals(user._id)) {
          isLike = true;
          break;
        }
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

exports.create = async (req, res, next) => {
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

exports.update = async (req, res, next) => {
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

exports.like = async (req, res, next) => {
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

exports.delete = async (req, res, next) => {
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

exports.getListComments = async (req, res, next) => {
  const {
    params: { id },
    limit,
    skip,
  } = req;

  try {
    const comments = await Comment.find({ post: id })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'user',
        select: 'fullName avatar',
      })
      .lean();

    return res.status(httpStatus.OK).json(comments);
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  const {
    body: { text },
    params: { id },
    user,
  } = req;
  try {
    const post = await Post.findById(id).lean();
    if (!post) {
      throw new Error('Không tìm thấy bài viết.');
    }

    const comment = await Comment.create({
      user,
      text,
      post: id,
    });

    !post.user.equals(user._id) &&
      (await Notification.create({
        user: post.user,
        text: `${user.fullName.firstName} đã bình luận về bài viết của bạn.`,
      }));

    return res.status(httpStatus.CREATED).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.getHotPost = async (req, res, next) => {
  const query = req.body.user ? { user: req.body.user } : {};

  try {
    const posts = await Post.find(query)
      .sort({ likes: -1 })
      .limit(10)
      .lean();

    return res.status(httpStatus.OK).json(posts);
  } catch (err) {
    next(err);
  }
};
