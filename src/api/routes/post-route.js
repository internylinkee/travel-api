const express = require('express');
const validate = require('express-validation');
const postControllers = require('../controllers/post-controller');
const postValidations = require('../validations/post-validate');
const { authorize } = require('../middlewares/auth');
const { paginate } = require('../middlewares/paginate');

const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();

router
  .route('/')
  /**
   *  @swagger
   *  /posts:
   *    get:
   *      security:
   *      - bearerAuth: []
   *      tags:
   *      - Post
   *      summary: Get list of post
   *      description: Get list of post with pagination and query by name, location, category
   *      parameters:
   *      - in: query
   *        name: q
   *        description: Search post by title and content
   *        schema:
   *          type: string
   *      - in: query
   *        name: page
   *        description: Page of pagination
   *        schema:
   *          type: integer
   *      - in: query
   *        name: location
   *        schema:
   *          type: string
   *        description: The id of location
   *      - in: query
   *        name: category
   *        schema:
   *          type: string
   *        description: The id of category
   *      - in: query
   *        name: user
   *        schema:
   *          type: string
   *        description: The id of user
   *
   *      responses:
   *        200:
   *          description: OK
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Post'
   *        400:
   *          description: Bad request
   */

  .get(validate(postValidations.getList), paginate(), postControllers.getList)
  /**
   *  @swagger
   *    /posts:
   *      post:
   *        security:
   *        - bearerAuth: []
   *        tags:
   *        - Post
   *        summary: Create a post
   *        description: Create a post include images, title, content, tags
   *        requestBody:
   *          content:
   *            multipart/form-data:
   *              schema:
   *                type: object
   *                properties:
   *                  images:
   *                    type: array
   *                    description: The images of the post
   *                    items:
   *                      type: string
   *                      format: binary
   *                  title:
   *                    type: string
   *                    description: The title of the post
   *                    example: Da Nang City
   *                  content:
   *                    type: string
   *                    description: The content of the post
   *                    example: Da Nang City
   *                  locations:
   *                    type: array
   *                    items:
   *                      type: string
   *                  categories:
   *                    type: array
   *                    description: The id of category tag
   *                    items:
   *                      type: string
   *                  type:
   *                    type: string
   *                    description: The kind of the post
   *                    enum: ['review', 'question']
   *              encoding:
   *                locations:
   *                  contentType: application/json
   *        responses:
   *          200:
   *            description: OK
   *            content:
   *              application/json:
   *                schema:
   *                  $ref: '#/components/schemas/Post'
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
    upload.array('images', 10),
    validate(postValidations.create),
    authorize(),
    postControllers.create,
  );

router.route('/hot').get(authorize(), postControllers.getHotPost);

router
  .route('/:id')
  /**
   * @swagger
   * /posts/{id}:
   *    get:
   *      security:
   *      - bearerAuth: []
   *      tags:
   *      - Post
   *      summary: Get detail a post
   *      description: Get detail info of the post by id
   *      parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *          example: 5d12cf9655c2f709a9277989
   *      responses:
   *        200:
   *          description: Ok
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Post'
   *        400:
   *          description: Bad request
   *        401:
   *          description: No auth token
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/noAuthToken'
   */
  .get(validate(postValidations.get), postControllers.get)
  /**
   *  @swagger
   *    /posts/{id}:
   *      put:
   *        security:
   *        - bearerAuth: []
   *        tags:
   *        - Post
   *        summary: Update a post
   *        description: Update a post by post id
   *        parameters:
   *        - in: path
   *          name: id
   *          description: Post id
   *          schema:
   *            type: string
   *        requestBody:
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  title:
   *                    type: string
   *                  content:
   *                    type: string
   *                  locations:
   *                    type: array
   *                    items:
   *                      type: string
   *                  categories:
   *                    type: array
   *                    items:
   *                      type: string
   *                  type:
   *                    type: string
   *        responses:
   *          200:
   *            description: OK
   *            content:
   *              application/json:
   *                schema:
   *                  $ref: '#/components/schemas/Post'
   *          400:
   *            description: Bad request
   *          401:
   *            description: No auth token
   *            content:
   *              application/json:
   *                schema:
   *                  $ref: '#/components/noAuthToken'
   */
  .put(validate(postValidations.update), authorize(), postControllers.update)
  .delete(
    validate(postValidations.delete),
    authorize(),
    postControllers.delete,
  );

router
  .route('/:id/like')
  .put(validate(postValidations.like), authorize(), postControllers.like);

router
  .route('/:id/comments')
  .get(
    validate(postValidations.getListComments),
    authorize(),
    paginate(),
    postControllers.getListComments,
  )
  .post(
    validate(postValidations.createComment),
    authorize(),
    postControllers.createComment,
  );

module.exports = router;
