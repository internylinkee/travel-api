const express = require('express');

const authRoutes = require('./auth-route');
const userRoutes = require('./user-route');
const applicationRoutes = require('./application-route');
const postRoutes = require('./post-route');
const commentRoutes = require('./comment-route');
const reviewRoutes = require('./review-route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/applications', applicationRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;
