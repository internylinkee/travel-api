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
  .get(
    validate(userValidations.getList),
    authorize(ADMIN),
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
   *       schema:
   *        $ref: '#/definitions/User'
   *     - in: header
   *       name: Authorization
   *       required: true
   *       description: Access token
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
   */
  .get(validate(userValidations.get), authorize(), userControllers.get)
  .put(validate(userValidations.update), authorize(), userControllers.update)
  .delete(
    validate(userValidations.delete),
    authorize(ADMIN),
    userControllers.delete,
  );
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
 *     - in: header
 *       name: Authorization
 *       required: true
 *       description: The access token
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
 *         desscription: OK
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 */

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
   */
  .put(validate(userValidations.follow), authorize(), userControllers.follow);

module.exports = router;
