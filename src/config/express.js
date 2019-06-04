const express = require('express');
const app = express();

const routes = require('../api/routes/index');

app.use('/v1', routes);

module.exports = app;
