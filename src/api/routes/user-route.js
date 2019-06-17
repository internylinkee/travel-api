const express = require('express');
const validate = require('express-validation');
const userControllers = require('../controllers/user-controller');
const userValidations = require('../validations/user-validate');
const { authorize, ADMIN } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/:id')
  .get(validate(userValidations.get), authorize(), userControllers.get)
  .put(validate(userValidations.update), authorize(), userControllers.update);

router
  .route('/:id/follow')
  .put(validate(userValidations.follow), authorize(), userControllers.follow);

module.exports = router;
