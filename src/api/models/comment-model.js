const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    text: String,
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

function addDeleteQuery(query) {
  query.deletedAt = null;
}

commentSchema.pre('find', function(next) {
  addDeleteQuery(this.getQuery());
  next();
});

commentSchema.pre('findOne', function(next) {
  addDeleteQuery(this.getQuery());
  next();
});

commentSchema.pre('findOneAndUpdate', function(next) {
  addDeleteQuery(this.getQuery());
  next();
});

module.exports = mongoose.model('Comment', commentSchema, 'comments');
