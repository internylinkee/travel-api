const express = require('express');
const categoryControllers = require('../controllers/category-controller');

const router = express.Router();
/**
 *  @swagger
 *    /categories:
 *      get:
 *        tags:
 *        - Category
 *        summary: Get list categories
 *        description: Get list categories
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Category'
 */
router.get('/', categoryControllers.getList);

module.exports = router;
