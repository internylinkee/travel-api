const express = require('express');
const validate = require('express-validation');
const authController = require('../controllers/auth-controller');
const { register, login } = require('../validations/auth-validate');

const router = express.Router();
/**
 * @swagger
 * /auth/register:
 *  post:
 *    tags:
 *    - Auth
 *    summary: Register a user
 *    description: Resigter a user by email, password, user's name
 *    requestBody:
 *      required: true
 *      decription: The info to register a user
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              confirmPassword:
 *                type: string
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 *                accessToken:
 *                  type: string
 *      400:
 *        description: Bad request
 *
 */
router.post('/register', validate(register), authController.register);
/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags:
 *    - Auth
 *    summary: Register a user
 *    description: Resigter a user by email, password, user's name
 *    requestBody:
 *      required: true
 *      description: Login by email and password
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *              required: true
 *
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 *                accessToken:
 *                  type: string
 *      400:
 *        description: Bad request
 *
 */
router.post('/login', validate(login), authController.login);

module.exports = router;
