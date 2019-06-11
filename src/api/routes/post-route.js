const express = require('express');
const validate = require('express-validation');
const postValidations = require('../validations/post-validate');
const { authorize } = require('../middlewares/auth');
const { paginate } = require('../middlewares/paginate');
const {
  getList,
  get,
  create,
  update,
  like,
  deletePost,
  createComment,
} = require('../controllers/post-controller');

const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();

router
  .route('/')
  .get(validate(postValidations.getList), paginate(), authorize(), getList)
  .post(
    upload.array('images', 10),
    validate(postValidations.create),
    authorize(),
    create,
  );

router
  .route('/:id')
  .get(validate(postValidations.get), authorize(), get)
  .put(validate(postValidations.update), authorize(), update)
  .delete(validate(postValidations.deletePost), authorize(), deletePost);

router
  .route('/:id/like')
  .put(validate(postValidations.like), authorize(), like);

router
  .route('/:id/comment')
  .post(validate(postValidations.createComment), authorize(), createComment);

module.exports = router;
