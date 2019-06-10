const mongoose = require('mongoose');

const REVIEW = 'review';
const QUESTION = 'question';

const typeEnum = [REVIEW, QUESTION];

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: String,
    content: String,
    featureImage: String,
    images: [String],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    shares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    locations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      },
    ],
    type: {
      type: String,
      enum: typeEnum,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Post', postSchema, 'posts');
