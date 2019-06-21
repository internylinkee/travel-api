const express = require('express');
const validate = require('express-validation');
const applicationControllers = require('../controllers/application-controller');
const applicationValidations = require('../validations/application-validate');
const { authorize, ADMIN } = require('../middlewares/auth');
const { paginate } = require('../middlewares/paginate');

const router = express.Router();

router
  .route('/')
  .get(
    validate(applicationValidations.getList),
    authorize(ADMIN),
    paginate(),
    applicationControllers.getList
  )
  .post(
    validate(applicationValidations.create),
    authorize(),
    applicationControllers.create
  );

router
  .route('/:id')
  .get(
    validate(applicationValidations.get),
    authorize(),
    applicationControllers.get
  );

module.exports = router;
