const express = require('express');
const validate = require('express-validation');
const commentControllers = require('../controllers/comment-controller');
const commentValidations = require('../validations/comment-validate');
const { authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/:id')
  .put(
    validate(commentValidations.update),
    authorize(),
    commentControllers.update,
  )
  .delete(
    validate(commentValidations.delete),
    authorize(),
    commentControllers.delete,
  );

module.exports = router;
