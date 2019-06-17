const express = require('express');
const validate = require('express-validation');
const notifyControllers = require('../controllers/notification-controller');
const notifyValidations = require('../validations/notification-validate');
const { authorize } = require('../middlewares/auth');
const { paginate } = require('../middlewares/paginate');

const router = express.Router();

router.route('/').get(authorize(), paginate(), notifyControllers.getAll);

router.route('/count-unread').get(authorize(), notifyControllers.countUnread);

router
  .route('/:id/read')
  .put(
    validate(notifyValidations.markAsRead),
    authorize(),
    notifyControllers.markAsRead,
  );

module.exports = router;
