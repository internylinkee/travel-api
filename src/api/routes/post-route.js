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
  .get(validate(postValidations.getList), paginate(), postControllers.getList)
  .post(
    upload.array('images', 10),
    validate(postValidations.create),
    authorize(),
    postControllers.create,
  );

router.route('/hot').get(authorize(), postControllers.getHotPost);

router
  .route('/:id')
  .get(validate(postValidations.get), authorize(), postControllers.get)
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
