const express = require('express');
const validate = require('express-validation');
const userControllers = require('../controllers/user-controller');
const userValidations = require('../validations/user-validate');
const { authorize, ADMIN } = require('../middlewares/auth');
const { paginate } = require('../middlewares/paginate');

const router = express.Router();

/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       roles:
 *         type: string
 *       followers:
 *         type: array
 *         items:
 *            type: string
 *            properties:
 *              name:
 *                type: string
 *       isTourGuide:
 *         type: boolean
 *       email:
 *         type: string
 *         format: email
 *       password:
 *         type: string
 *         format: password
 *       fullname:
 *         type: object
 *         properties:
 *           firstName:
 *             type: string
 *           lastname:
 *             type: string
 *       createdAt:
 *         type: string
 *         format: date
 *       updatedAt:
 *         type: string
 *         format: date
 *       tourGuideProfile:
 *         type: object
 *         properties:
 *            rating:
 *              type: number
 *            location:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                name:
 *                  type: string
 *            reviewCount:
 *               type: number
 *            certificate:
 *               type: string
 *            introduction:
 *               type: string
 *
 */

router
  .route('/')
  /**
   * @swagger
   * /users:
   *  get:
   *    tags:
   *    - User
   *    summary: Get list of users
   *    description: Get list of users by admin and implement pagination
   *    parameters:
   *    - in: query
   *      name: page
   *      description: Index of the page
   *      type: integer
   *      schema:
   *        type: integer
   *        mininum: 1
   *      default: 1
   *    - in: query
   *      name: admin
   *      description: Select users is admin
   *      type: boolean
   *      schema:
   *        type: boolean
   *      default: false
   *    - in: query
   *      name: tourGuide
   *      type: boolean
   *      description: Select user is tour guide
   *      schema:
   *        type: boolean
   *      default: false
   *    - in: query
   *      name: q
   *      description: Select user by user's name
   *      type: string
   *    - in: header
   *      name: Authorization
   *      type: string
   *      default: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6eyJmaXJzdE5hbWUiOiJNaW50IiwibGFzdE5hbWUiOiJOZ28ifSwicm9sZSI6InVzZXIiLCJmb2xsb3dlcnMiOltdLCJpc1RvdXJHdWlkZSI6ZmFsc2UsIl9pZCI6IjVkMTAyZGM2ZjgyYjIxMGE3YTBmOTM3YiIsImVtYWlsIjoiYWJjMTIzQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMTktMDYtMjRUMDE6NTY6MjIuMzYwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDYtMjRUMDI6MDg6NDAuMDc1WiIsIl9fdiI6MCwiaWF0IjoxNTYxMzQ1NDQ3LCJleHAiOjE1NjEzODg2NDd9.8fRfwwq7K0Nb7hhA70Kjle8rHgXfA4M34Yx-DnuH_uE
   *    responses:
   *      200:
   *        description: OK
   *        schema:
   *          type: array
   *          items:
   *            type: object
   *            $ref: '#/definitions/User'
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
   *     tags:
   *     - User
   *     summary: Get user by id
   *     description: Get the info of user by user id
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       description: User id
   *       default: 5d102dc6f82b210a7a0f937b
   *     - in: header
   *       name: Authorization
   *       required: true
   *       description: Access token
   *       default: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6eyJmaXJzdE5hbWUiOiJNaW50IiwibGFzdE5hbWUiOiJOZ28ifSwicm9sZSI6InVzZXIiLCJmb2xsb3dlcnMiOltdLCJpc1RvdXJHdWlkZSI6ZmFsc2UsIl9pZCI6IjVkMTAyZGM2ZjgyYjIxMGE3YTBmOTM3YiIsImVtYWlsIjoiYWJjMTIzQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMTktMDYtMjRUMDE6NTY6MjIuMzYwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDYtMjRUMDI6MDg6NDAuMDc1WiIsIl9fdiI6MCwiaWF0IjoxNTYxMzQ1NDQ3LCJleHAiOjE1NjEzODg2NDd9.8fRfwwq7K0Nb7hhA70Kjle8rHgXfA4M34Yx-DnuH_uE
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: The info of user
   *         schema:
   *           type: object
   *           properties:
   *             users:
   *               $ref: '#/definitions/User'
   *             isFollow:
   *               type: boolean
   *       400:
   *         description: The id must be a objectId
   *       401:
   *         description: No auth token
   *         schema:
   *          type: object
   *          properties:
   *            status:
   *              type: interger
   *              example: 401
   *            message:
   *              type: string
   *              example: No auth token
   *       404:
   *         description: Not found
   *         schema:
   *           type: object
   *           properties:
   *            status:
   *              type: interger
   *              example: 404
   *            message:
   *              type: string
   *              example: User not found.
   */
  .get(validate(userValidations.get), authorize(), userControllers.get)
  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     tags:
   *     - User
   *     summary: Update user
   *     description: Update the info of user by user id
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       description: User id
   *       default: 5d102dc6f82b210a7a0f937b
   *     - in: header
   *       name: Authorization
   *       required: true
   *       description: The access token
   *       default: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6eyJmaXJzdE5hbWUiOiJNaW50IiwibGFzdE5hbWUiOiJOZ28ifSwicm9sZSI6InVzZXIiLCJmb2xsb3dlcnMiOltdLCJpc1RvdXJHdWlkZSI6ZmFsc2UsIl9pZCI6IjVkMTAyZGM2ZjgyYjIxMGE3YTBmOTM3YiIsImVtYWlsIjoiYWJjMTIzQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMTktMDYtMjRUMDE6NTY6MjIuMzYwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDYtMjRUMDI6MDg6NDAuMDc1WiIsIl9fdiI6MCwiaWF0IjoxNTYxMzQ1NDQ3LCJleHAiOjE1NjEzODg2NDd9.8fRfwwq7K0Nb7hhA70Kjle8rHgXfA4M34Yx-DnuH_uE
   *     - in: body
   *       name: body
   *       required: true
   *       schema:
   *         type: object
   *         properties:
   *           firstName:
   *             type: string
   *           lastName:
   *             type: string
   *           facebookUrl:
   *             type: string
   *           phone:
   *             type: string
   *           location:
   *             type: string
   *           certificate:
   *             type: string
   *           introduction:
   *             type: string
   *     produces:
   *     - application/json
   *     responses:
   *       200:
   *         description: OK
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   *       400:
   *         description: Bad request
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: interger
   *               example: 400
   *             message:
   *               type: string
   *               example: Bạn không thể cập nhật thông tin của người dùng khác.
   *       401:
   *         description: No auth token
   *         schema:
   *          type: object
   *          properties:
   *            status:
   *              type: interger
   *              example: 401
   *            message:
   *              type: string
   *              example: No auth token
   */
  .put(validate(userValidations.update), authorize(), userControllers.update)
  /**
   * @swagger
   * /users/{id}:
   *  delete:
   *    tags:
   *    - User
   *    summary: Delete a user
   *    description: Delete a user by admin
   *    parameters:
   *    - in: path
   *      name: id
   *      required: true
   *      description: User id
   *      default: 5d102dc6f82b210a7a0f937b
   *    - in: headers
   *      name: Authorization
   *      required: true
   *      description: The access token
   *      default: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6eyJmaXJzdE5hbWUiOiJNaW50IiwibGFzdE5hbWUiOiJOZ28ifSwicm9sZSI6InVzZXIiLCJmb2xsb3dlcnMiOltdLCJpc1RvdXJHdWlkZSI6ZmFsc2UsIl9pZCI6IjVkMTAyZGM2ZjgyYjIxMGE3YTBmOTM3YiIsImVtYWlsIjoiYWJjMTIzQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMTktMDYtMjRUMDE6NTY6MjIuMzYwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDYtMjRUMDI6MDg6NDAuMDc1WiIsIl9fdiI6MCwiaWF0IjoxNTYxMzQ1NDQ3LCJleHAiOjE1NjEzODg2NDd9.8fRfwwq7K0Nb7hhA70Kjle8rHgXfA4M34Yx-DnuH_uE
   *    produces:
   *    - application/json
   *    responses:
   *      200:
   *        description: OK
   *        schema:
   *          type: object
   *          properties:
   *            message:
   *              type: string
   *              example: 'Đã xoá thành công'
   *      400:
   *        description: Bad request
   *        schema:
   *          type: object
   *          properties:
   *            status:
   *              type: interger
   *              example: 400
   *            message:
   *              type: string
   *              example: Không thể xoá tài khoản là chính bạn.
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
   *    tags:
   *    - User
   *    summary: Follow-unfollow a user
   *    description: Follow or unfollow a user by user id
   *    parameters:
   *    - in: path
   *      name: id
   *      required: true
   *      description: User id
   *    - in: header
   *      name: Authorization
   *      required: true
   *      description: Access token
   *    responses:
   *      200:
   *        description: OK
   *        schema:
   *          type: object
   *          properties:
   *            likeCount:
   *              type: number
   *      400:
   *        description: Bad request
   *        schema:
   *          type: object
   *          properties:
   *            status:
   *              type: interger
   *              example: 400
   *            message:
   *              type: string
   *              example: User not found.
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
  .put(validate(userValidations.follow), authorize(), userControllers.follow);

module.exports = router;
