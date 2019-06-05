const express = require('express');
const validate = require('express-validation');
const userController = require('../controllers/user-controller');
const { authorize, ADMIN } = require('../middlewares/auth');
const { get, update } = require('../validations/user-validate');

const router = express.Router();

router
  .route('/:id')
  .get(validate(get), authorize(), userController.get)
  .put(validate(update), authorize(), userController.update);

router.route('/:id/follow').put(authorize(), userController.follow);

module.exports = router;
