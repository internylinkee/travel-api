const express = require('express');
const validate = require('express-validation');
const userControllers = require('../controllers/user-controller');
const userValidations = require('../validations/user-validate');
const { authorize, ADMIN } = require('../middlewares/auth');
const { paginate } = require('../middlewares/paginate');

const router = express.Router();

router
  .route('/')
  .get(
    validate(userValidations.getList),
    authorize(ADMIN),
    paginate(),
    userControllers.getList,
  );

router
  .route('/:id')
  .get(validate(userValidations.get), authorize(), userControllers.get)
  .put(validate(userValidations.update), authorize(), userControllers.update)
  .delete(
    validate(userValidations.delete),
    authorize(ADMIN),
    userControllers.delete,
  );

router
  .route('/:id/follow')
  .put(validate(userValidations.follow), authorize(), userControllers.follow);

module.exports = router;
