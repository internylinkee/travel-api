const express = require('express');
const validate = require('express-validation');
const authController = require('../controllers/auth-controller');
const { register } = require('../validations/auth-validate');

const router = express.Router();

router.post('/register', validate(register), authController.register);

module.exports = router;
