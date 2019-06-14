const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tourGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String,
    rating: Number,
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

function addDeleteQuery(query) {
  query.deletedAt = null;
}

reviewSchema.pre('find', function(next) {
  addDeleteQuery(this.getQuery());
  next();
});

reviewSchema.pre('findOne', function(next) {
  addDeleteQuery(this.getQuery());
  next();
});

reviewSchema.pre('findOneAndUpdate', function(next) {
  addDeleteQuery(this.getQuery());
  next();
});

module.exports = mongoose.model('Review', reviewSchema, 'reviews');
