const express = require('express');
const validate = require('express-validation');
const postControllers = require('../controllers/post-controller');
const { authorize, ADMIN } = require('../../api/middlewares/auth');
const postValidations = require('../validations/post-validate');

const router = express.Router();

router
  .route('/:id')
  /**
   *  @swagger
   *    /admin/posts/{id}:
   *      delete:
   *        security:
   *        - bearerAuth: []
   *        tags:
   *        - Admin
   *        summary: Delete a post
   *        description: Delete a post
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
  .delete(validate(postValidations), authorize(ADMIN), postControllers.delete);

module.exports = router;
