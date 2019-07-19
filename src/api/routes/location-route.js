const express = require('express');
const locationControllers = require('../controllers/location-controller');

const router = express.Router();
/**
 *  @swagger
 *    /v1/locations:
 *      get:
 *        tags:
 *        - Location
 *        summary: Get list locations
 *        description: Get list locations
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Location'
 */
router.get('/', locationControllers.getList);

module.exports = router;
