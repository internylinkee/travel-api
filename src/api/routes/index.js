const express = require('express');
const app = express();

const userRoutes = require('./user-route');

app.use('/users', userRoutes);

module.exports = app;
