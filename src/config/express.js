const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const { logs } = require('./vars');

const routes = require('../api/routes');

const passport = require('passport');
const strategies = require('./passport');

const app = express();

app.use(logger(logs));
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

passport.use('jwt', strategies.jwt);

app.use('/v1', routes);

app.use((err, req, res, next) => {
  const { status, message, errors, stack } = err;
  res.status(status || 400).json({
    status: status || 400,
    message,
    errors,
    stack,
  });
});

module.exports = app;
