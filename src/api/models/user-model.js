const mongoose = require('mongoose');

const rolesEnum = ['user', 'admin'];

const userSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: String,
      lastName: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    avatar: String,
    facebookUrl: String,
    facebookId: String,
    phone: String,
    roles: {
      enum: rolesEnum,
      type: String,
      default: 'user',
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isTourGuide: {
      type: Boolean,
      default: false,
    },
    tourGuideProfile: {
      location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      },
      reviewCount: Number,
      rating: Number,
      certificate: String,
      introduction: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.post('save', (err, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('This email have been used.'));
  } else {
    next();
  }
});

module.exports = mongoose.model('User', userSchema, 'users');
