const express = require('express');

const userRoutes = require('./user-route');
const postRoutes = require('./post-route');
const applicationRoutes = require('./application-route');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/applications', applicationRoutes);

module.exports = router;
