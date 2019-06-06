const express = require('express');

const authRoutes = require('./auth-route');
const userRoutes = require('./user-route');
const applicationRoutes = require('./application-route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/applications', applicationRoutes);

module.exports = router;
