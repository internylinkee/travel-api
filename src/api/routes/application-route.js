const express = require('express');
const validate = require('express-validation');
const applicationControllers = require('../controllers/application-controller');
const { authorize } = require('../middlewares/auth');
const { create } = require('../validations/application-validate');

const router = express.Router();

router
  .route('/')
  .post(validate(create), authorize(), applicationControllers.create);

module.exports = router;
