const express = require('express');
const validate = require('express-validation');
const userController = require('../controllers/auth-controller');
const { register } = require('../validations/auth-validate');

const route = express.Router();

route.post('/register', validate(register), userController.register);

module.exports = route;
