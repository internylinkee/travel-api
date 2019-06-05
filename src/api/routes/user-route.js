const express = require('express');
const validate = require('express-validation');
const userController = require('../controllers/user-controller');
const { get, update } = require('../validations/user-validate');

const router = express.Router();

router
  .route('/:id')
  .get(validate(get), userController.get)
  .put(validate(update), userController.update);

module.exports = router;
