const mongoose = require('mongoose');
const httpStatus = require('http-status');

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

function addDeleteQuery(query) {
  query.deletedAt = null;
}

userSchema.pre('find', function(next) {
  addDeleteQuery(this.getQuery());
  next();
});

userSchema.pre('findOne', function(next) {
  addDeleteQuery(this.getQuery());
  next();
});

userSchema.post('save', (err, res, next) => {
  if (err.name === 'MongoError' && err.code === 11000) {
    next({
      status: httpStatus.CONFLICT,
      message: 'This email is already in use.',
    });
  } else {
    next();
  }
});

module.exports = mongoose.model('User', userSchema, 'users');
