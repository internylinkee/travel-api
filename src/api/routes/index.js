const express = require('express');
const app = express();

const authRoutes = require('./auth-route');
const userRoutes = require('./user-route');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

module.exports = app;
