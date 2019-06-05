const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../api/models/user-model');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports.jwt = new JwtStrategy(options, async function(payload, done) {
  try {
    const user = await User.findById(payload._id);
    if (!user) {
      done(new Error('User not found'), false);
    }
    return done(null, user);
  } catch (err) {
    done(err, false);
  }
});
