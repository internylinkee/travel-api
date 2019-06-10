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
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

function addDeleteQuery(query) {
  query.deletedAt = null;
}

postSchema.pre('find', function(next) {
  addDeleteQuery(this.getQuery());
  next();
});

postSchema.pre('findOne', function(next) {
  addDeleteQuery(this.getQuery());
  next();
});

postSchema.pre('findOneAndUpdate', function(next) {
  addDeleteQuery(this.getQuery());
  next();
});

module.exports = mongoose.model('Post', postSchema, 'posts');
