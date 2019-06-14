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

module.exports = mongoose.model('Review', reviewSchema, 'reviews');
