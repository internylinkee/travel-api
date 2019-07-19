const express = require('express');
const uploadControllers = require('../controllers/upload-controller');
const { authorize } = require('../middlewares/auth');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = express.Router();

router
  .route('/')
  /**
   *  @swagger
   *    /v1/upload:
   *      post:
   *        security:
   *        - bearerAuth: []
   *        tags:
   *        - Upload
   *        summary: Upload files
   *        description: Upload files
   *        requestBody:
   *          content:
   *            multipart/form-data:
   *              schema:
   *                type: object
   *                properties:
   *                  images:
   *                      type: array
   *                      description: The images
   *                      items:
   *                        type: string
   *                        format: binary
   *        responses:
   *          200:
   *            description: OK
   *            content:
   *              application/json:
   *                schema:
   *                  type: array
   *                  items:
   *                    type: string
   *          400:
   *            description: Bad request
   *          401:
   *            description: No auth token
   *            content:
   *              application/json:
   *                schema:
   *                  $ref: '#/components/noAuthToken'
   */

  .post(upload.array('images', 10), authorize(), uploadControllers.upload);

module.exports = router;
