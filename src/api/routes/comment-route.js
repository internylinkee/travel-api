const express = require('express');
const validate = require('express-validation');
const commentControllers = require('../controllers/comment-controller');
const commentValidations = require('../validations/comment-validate');
const { authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/:id')
  /**
   *  @swagger
   *    /comments/{id}:
   *      put:
   *        security:
   *        - bearerAuth: []
   *        tags:
   *        - Comment
   *        summary: Update a comment
   *        description: Update a comment by id
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
  .put(
    validate(commentValidations.update),
    authorize(),
    commentControllers.update,
  )
  /**
   *  @swagger
   *    /comments/{id}:
   *      delete:
   *        security:
   *        - bearerAuth: []
   *        tags:
   *        - Comment
   *        summary: Delete a comment
   *        description: Delete a comment by id
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
  .delete(
    validate(commentValidations.delete),
    authorize(),
    commentControllers.delete,
  );

module.exports = router;
