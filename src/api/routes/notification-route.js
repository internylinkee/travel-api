const express = require('express');
const notifyControllers = require('../controllers/notification-controller');
const { authorize } = require('../middlewares/auth');
const { paginate } = require('../middlewares/paginate');

const router = express.Router();

router.route('/').get(authorize(), paginate(), notifyControllers.getAll);
router.route('/count-unread').get(authorize(), notifyControllers.countUnread);

module.exports = router;
