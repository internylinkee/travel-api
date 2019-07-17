const mongoose = require('mongoose');

const STATUS_PENDING = 'pending';
const STATUS_CANCEL = 'cancel';
const STATUS_CONFIRMED = 'confirmed';

const statusEnum = [STATUS_PENDING, STATUS_CANCEL, STATUS_CONFIRMED];

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
      default: STATUS_PENDING,
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
module.exports.STATUS_PENDING = STATUS_PENDING;
module.exports.STATUS_CANCEL = STATUS_CANCEL;
module.exports.STATUS_CONFIRMED = STATUS_CONFIRMED;
