const mongoose = require('mongoose');

const PENDING = 'pending';
const CANCEL = 'cancel';
const CONFIRMED = 'confirmed';

const statusEnum = [PENDING, CANCEL, CONFIRMED];

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    },
    certificate: String,
    introduction: String,
    status: {
      type: String,
      enum: statusEnum,
      default: PENDING,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  'Application',
  applicationSchema,
  'applications',
);
