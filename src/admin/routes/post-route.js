const express = require('express');
const validate = require('express-validation');
const postControllers = require('../controllers/post-controller');
const { authorize, ADMIN } = require('../../api/middlewares/auth');
const postValidations = require('../validations/post-validate');

const router = express.Router();

router
  .route('/:id')
  .delete(validate(postValidations), authorize(ADMIN), postControllers.delete);

module.exports = router;
