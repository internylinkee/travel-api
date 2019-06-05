const express = require('express');
const validate = require('express-validation');
const authController = require('../controllers/auth-controller');
const { register, login } = require('../validations/auth-validate');

const router = express.Router();

router.post('/register', validate(register), authController.register);
router.post('/login', validate(login), authController.login);

module.exports = router;
