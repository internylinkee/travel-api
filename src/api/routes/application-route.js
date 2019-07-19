const express = require('express');
const validate = require('express-validation');
const applicationControllers = require('../controllers/application-controller');
const applicationValidations = require('../validations/application-validate');
const { authorize, ADMIN } = require('../middlewares/auth');
const { paginate } = require('../middlewares/paginate');

const router = express.Router();

router
  .route('/')
  /**
   *  @swagger
   *    /v1/applications:
   *      post:
   *        security:
   *        - bearerAuth: []
   *        tags:
   *        - Application
   *        summary: Create a application
   *        description: Create a application
   *        requestBody:
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  location:
   *                    type: string
   *                  certificate:
   *                    type: string
   *                  introduction:
   *                    type: string
   *        responses:
   *          200:
   *            description: OK
   *            content:
   *              application/json:
   *                schema:
   *                  $ref: '#/components/schemas/Application'
   *          400:
   *            description: Bad request
   *          401:
   *            description: No auth token
   *            content:
   *              application/json:
   *                schema:
   *                  $ref: '#/components/noAuthToken'
   */
  .post(
    validate(applicationValidations.create),
    authorize(),
    applicationControllers.create,
  );

router
  .route('/:id')
  /**
   *  @swagger
   *    /v1/applications/{id}:
   *      get:
   *        security:
   *        - bearerAuth: []
   *        tags:
   *        - Application
   *        summary: Get a application
   *        description: Get a application
   *        parameters:
   *        - in: param
   *          name: id
   *          required: true
   *          schema:
   *            type: string
   *        responses:
   *          200:
   *            description: OK
   *            content:
   *              application/json:
   *                schema:
   *                  $ref: '#/components/schemas/Application'
   *          400:
   *            description: Bad request
   *          401:
   *            description: No auth token
   *            content:
   *              application/json:
   *                schema:
   *                  $ref: '#/components/noAuthToken'
   */
  .get(
    validate(applicationValidations.get),
    authorize(),
    applicationControllers.get,
  );

module.exports = router;
