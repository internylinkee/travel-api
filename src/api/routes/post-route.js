const express = require('express');
const validate = require('express-validation');
const postValidations = require('../validations/post-validate');
const { authorize } = require('../middlewares/auth');
const { create } = require('../controllers/post-controller');

const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();

router
  .route('/')
  .post(
    upload.array('images', 10),
    validate(postValidations.create),
    authorize(),
    create,
  );

module.exports = router;
