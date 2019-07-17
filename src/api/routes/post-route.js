const express = require('express');
const validate = require('express-validation');
const postControllers = require('../controllers/post-controller');
const postValidations = require('../validations/post-validate');
const { authorize } = require('../middlewares/auth');
const { paginate } = require('../middlewares/paginate');

const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

const router = express.Router();

router
  .route('/')
  /**
   *  @swagger
   *  /posts:
   *    get:
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
   *                    enum: ['review', 'question', 'tour']
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

/**
 *  @swagger
 *  /posts/hot:
 *    get:
 *      tags:
 *      - Post
 *      summary: Get a list of hit posts
 *      description: Get top 10 hit posts
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  $ref: '#/components/schemas/Post'
 *
 */
router.route('/hot').get(postControllers.getHotPost);

router
  .route('/:id')
  /**
   * @swagger
   * /posts/{id}:
   *    get:
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
  /**
   *  @swagger
   *  /posts/{id}:
   *    delete:
   *      security:
   *      - bearerAuth: []
   *      tags:
   *      - Post
   *      summary: Delete a post
   *      description: Delete a post by post's id
   *      parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: The post id
   *        schema:
   *          type: string
   *          example: 5d11989c40706890cade2228
   *      responses:
   *        200:
   *          description: OK
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: Xoá bài viết thành công.
   *        400:
   *          description: Bad request
   *        401:
   *          description: No auth token
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/noAuthToken'
   */
  .delete(
    validate(postValidations.delete),
    authorize(),
    postControllers.delete,
  );

router
  .route('/:id/like')
  /**
   *  @swagger
   *  /posts/{id}/like:
   *    put:
   *      security:
   *      - bearerAuth: []
   *      tags:
   *      - Post
   *      summary: Like or unlike a post
   *      description: Like or unlike a post by post id
   *      parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: The post id
   *        schema:
   *          type: string
   *          example: 5d11989c40706890cade2228
   *      responses:
   *        200:
   *          description: OK
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  likeCount:
   *                    type: number
   *        400:
   *          description: Bad request
   *        401:
   *          description: No auth token
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/noAuthToken'
   */
  .put(validate(postValidations.like), authorize(), postControllers.like);

router
  .route('/:id/comments')
  /**
   *  @swagger
   *  /posts/{id}/comments:
   *    get:
   *      security:
   *      - bearerAuth: []
   *      tags:
   *      - Post
   *      summary: Get list of comments of the post
   *      description: Get list of comments by id and implement pagination
   *      parameters:
   *      - in: path
   *        name: id
   *        description: The post id
   *        required: true
   *        schema:
   *          type: string
   *          example: 5d11989c40706890cade2228
   *      - in: query
   *        name: page
   *        description: The page number
   *        schema:
   *          type: int
   *          example: 1
   *      responses:
   *        200:
   *          description: OK
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Comment'
   *        400:
   *          description: Bad request
   *        401:
   *          description: No auth token
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/noAuthToken'
   */
  .get(
    validate(postValidations.getListComments),
    authorize(),
    paginate(),
    postControllers.getListComments,
  )
  /**
   *  @swagger
   *    /posts/{id}/comments:
   *      post:
   *        security:
   *        - bearerAuth: []
   *        tags:
   *        - Post
   *        summary: Create a comment belong in a specify post
   *        description: Create a comment belong in a specify post
   *        parameters:
   *        - in: path
   *          name: id
   *          description: The post id
   *          required: true
   *          schema:
   *            type: string
   *            example: 5d11989c40706890cade2228
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  text:
   *                    type: string
   *                    example: Hay qua
   *        responses:
   *          200:
   *            description: OK
   *            content:
   *              application/json:
   *                schema:
   *                  $ref: '#/components/schemas/Comment'
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
    validate(postValidations.createComment),
    authorize(),
    postControllers.createComment,
  );

module.exports = router;
