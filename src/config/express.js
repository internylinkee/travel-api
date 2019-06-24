const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');
const expressValidation = require('express-validation');
const swagger = require('./swagger');
const { logs } = require('./vars');

const routes = require('../api/routes');

const passport = require('passport');
const strategies = require('./passport');

const app = express();

swagger(app);

app.use(logger(logs));
app.use(helmet());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

passport.use('jwt', strategies.jwt);

app.use('/v1', routes);

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not found',
    status: 404,
  });
});

app.use((err, req, res, next) => {
  const { status, message, errors, stack } = err;
  if (err instanceof expressValidation.ValidationError) {
    const convertErrors = err.errors.map(error => ({
      messages: error.messages[0],
    }));
    return res.status(status || 400).json({
      status: status || 400,
      message,
      errors: convertErrors,
      stack,
    });
  }
  return res.status(status || 400).json({
    status: status || 400,
    message,
    errors,
    stack,
  });
});

module.exports = app;
