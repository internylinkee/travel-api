const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const ADMIN = 'admin';
const LOGGED_USER = 'user';
const rolesEnum = [LOGGED_USER, ADMIN];

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
    background: {
      type: String,
      default:
        'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    role: {
      enum: rolesEnum,
      type: String,
      default: LOGGED_USER,
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
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.statics = {
  async findOneAndGenerateToken(options) {
    const { email, password } = options;
    try {
      if (!email) {
        throw new Error('An email is required to generate a token');
      }
      const user = await this.findOne({ email });
      if (!user) {
        throw new Error('Email or password is not correct.');
      }

      const isCorrectPassword = await bcrypt.compare(
        password,
        user._doc.password,
      );
      if (!isCorrectPassword) {
        throw new Error('Email or password is not correct.');
      }
      delete user._doc.password;
      const accessToken = await jwt.sign(
        user.toJSON(),
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRATION,
        },
      );
      return { user, accessToken };
    } catch (err) {
      throw new Error(err);
    }
  },
};

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

userSchema.pre('findOneAndUpdate', function(next) {
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
module.exports.ADMIN = ADMIN;
module.exports.LOGGED_USER = LOGGED_USER;
