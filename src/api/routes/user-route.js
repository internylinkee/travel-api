const express = require('express');
const validate = require('express-validation');
const userControllers = require('../controllers/user-controller');
const userValidations = require('../validations/user-validate');
const { authorize, ADMIN } = require('../middlewares/auth');
const { paginate } = require('../middlewares/paginate');

const router = express.Router();

router
  .route('/')
  /**
   * @swagger
   * /users:
   *  get:
   *    security:
   *    - bearerAuth: []
   *    tags:
   *    - User
   *    summary: Get list of users
   *    description: Get list of users by admin and implement pagination
   *    parameters:
   *    - in: query
   *      name: page
   *      description: Index of the page
   *      schema:
   *        type: integer
   *        mininum: 1
   *      default: 1
   *    - in: query
   *      name: admin
   *      description: Select users is admin
   *      schema:
   *        type: boolean
   *      default: false
   *    - in: query
   *      name: tourGuide
   *      description: Select user is tour guide
   *      schema:
   *        type: boolean
   *      default: false
   *    - in: query
   *      name: q
   *      description: Select user is tour guide
   *      schema:
   *        type: string
   *
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                type: object
   *                $ref: '#/components/schemas/User'
   *      400:
   *        description: Bad request
   *      401:
   *        description: No auth token
   *        schema:
   *          type: object
   *          properties:
   *            status:
   *              type: interger
   *              example: 401
   *            message:
   *              type: string
   *              example: No auth token
   */
  .get(
    validate(userValidations.getList),
    authorize(),
    paginate(),
    userControllers.getList,
  );

router
  .route('/:id')
  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     security:
   *     - bearerAuth: []
   *     tags:
   *     - User
   *     summary: Get user by id
   *     description: Get the info of user by user id
   *     parameters:
   *     - in: path
   *       name: id
   *       description: The user's id
   *       required: true
   *       schema:
   *        type: string
   *        example: 5d119813f7d5360bf6100c22
   *     responses:
   *       200:
   *         description: The info of user
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 users:
   *                   $ref: '#/components/schemas/User'
   *                 isFollow:
   *                   type: boolean
   *       400:
   *         description: The id must be a objectId
   *       401:
   *         description: No auth token
   *         content:
   *           application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: interger
   *                    example: 401
   *                  message:
   *                    type: string
   *                    example: No auth token
   *       404:
   *         description: Not found
   *         content:
   *           application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: interger
   *                    example: 404
   *                  message:
   *                    type: string
   *                    example: User not found.
   */
  .get(validate(userValidations.get), authorize(), userControllers.get)
  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     security:
   *     - bearerAuth: []
   *     tags:
   *     - User
   *     summary: Update user
   *     description: Update the info of user by user id
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       description: User id
   *       schema:
   *         type: string
   *     requestBody:
   *        description: The info to update user
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                firstName:
   *                  type: string
   *                lastName:
   *                  type: string
   *                facebookUrl:
   *                  type: string
   *                phone:
   *                  type: string
   *                location:
   *                  type: string
   *                certificate:
   *                  type: string
   *                introduction:
   *                  type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/User'
   *       400:
   *         description: Bad request
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: interger
   *                    example: 400
   *                  message:
   *                    type: string
   *                    example: Bạn không thể cập nhật thông tin của người dùng khác.
   *       401:
   *         description: No auth token
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: interger
   *                    example: 401
   *                  message:
   *                    type: string
   *                    example: No auth token
   */
  .put(validate(userValidations.update), authorize(), userControllers.update)
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

router
  .route('/:id/follow')
  /**
   * @swagger
   * /users/{id}/follow:
   *  put:
   *    security:
   *    - bearerAuth: []
   *    tags:
   *    - User
   *    summary: Follow-unfollow a user
   *    description: Follow or unfollow a user by user id
   *    parameters:
   *    - in: path
   *      name: id
   *      required: true
   *      description: User id
   *      schema:
   *        type: integer
   *        example: 5d119813f7d5360bf6100c22
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                likeCount:
   *                  type: number
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
   *                  example: User not found.
   *      401:
   *        description: No auth token
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              $ref: '#/components/noAuthToken'
   */
  .put(validate(userValidations.follow), authorize(), userControllers.follow);

module.exports = router;
