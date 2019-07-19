const express = require('express');
const validate = require('express-validation');
const userControllers = require('../controllers/user-controller');
const userValidations = require('../validations/user-validate');
const { authorize, ADMIN } = require('../../api/middlewares/auth');
const { paginate } = require('../../api/middlewares/paginate');

const router = express.Router();

router
  .route('/')
  .get(
    validate(userValidations.getList),
    paginate(),
    authorize(ADMIN),
    userControllers.getList,
  );

router
  .route('/:id')
  /**
   * @swagger
   * /users/{id}:
   *  delete:
   *    security:
   *    - bearerAuth: []
   *    tags:
   *    - User
   *    summary: Delete a user
   *    description: Delete a user by admin
   *    parameters:
   *    - in: path
   *      name: id
   *      required: true
   *      description: User id
   *      schema:
   *        type: string
   *        example: 5d102dc6f82b210a7a0f937b
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *             schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: 'Đã xoá thành công'
   *      400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: interger
   *                  example: 400
   *                message:
   *                  type: string
   *                  example: Không thể xoá tài khoản là chính bạn.
   *      401:
   *        description: No auth token
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              $ref: '#/components/noAuthToken'
        
   */
  .delete(
    validate(userValidations.delete),
    authorize(ADMIN),
    userControllers.delete,
  );

module.exports = router;
