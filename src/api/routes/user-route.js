const express = require('express');
const validate = require('express-validation');
const userController = require('../controllers/user-controller');
const { get } = require('../validations/user-validate');

const route = express.Router();

route.get('/:id', validate(get), userController.get);

module.exports = route;
