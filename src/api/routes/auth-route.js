const express = require('express');
const validate = require('express-validation');
const authController = require('../controllers/auth-controller');
const { register } = require('../validations/auth-validate');

const route = express.Router();

route.post('/register', validate(register), authController.register);

module.exports = route;
