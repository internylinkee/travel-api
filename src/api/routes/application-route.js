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
   *    /applications:
   *      get:
   *        security:
   *        - bearerAuth: []
   *        tags:
   *        - Application
   *        summary: Get list applications
   *        description: Get list applications by admin
   *        parameters:
   *        - in: query
   *          name: page
   *          required: true
   *          schema:
   *            type: int
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
    validate(applicationValidations.getList),
    authorize(ADMIN),
    paginate(),
    applicationControllers.getList,
  )
  /**
   *  @swagger
   *    /applications:
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
   *    /applications/{id}:
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

router
  .route('/:id/cancel')
  /**
   *  @swagger
   *    /applications/{id}/cancel:
   *      put:
   *        security:
   *        - bearerAuth: []
   *        tags:
   *        - Application
   *        summary: Cancel a application
   *        description: Cancel a application by admin
   *        parameters:
   *        - in: param
   *          name: id
   *          qequired: true
   *          schema:
   *            type: string
   *        responses:
   *          200:
   *            description: OK
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    message:
   *                      type: string
   *          400:
   *            description: Bad request
   *          401:
   *            description: No auth token
   *            content:
   *              application/json:
   *                schema:
   *                  $ref: '#/components/noAuthToken'
   */
  .put(
    validate(applicationValidations.cancel),
    authorize(ADMIN),
    applicationControllers.cancel,
  );

module.exports = router;
