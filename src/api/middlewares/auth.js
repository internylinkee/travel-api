const passport = require('passport');
const httpStatus = require('http-status');

const ADMIN = 'admin';

const handleJWT = (req, res, next, role) => async (err, user, info) => {
  const error = err || info;
  const apiError = {
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  };

  if (!user) {
    next(apiError);
  }

  if (role === ADMIN) {
    if (user.role !== ADMIN) {
      next({
        message: 'Forbiden',
        status: httpStatus.FORBIDDEN,
      });
    }
  }

  req.user = user;

  return next();
};

exports.ADMIN = ADMIN;

exports.authorize = (role = 'user') => (req, res, next) =>
  passport.authenticate(
    'jwt',
    { session: false },
    handleJWT(req, res, next, role),
  )(req, res, next);
