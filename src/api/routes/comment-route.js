const express = require('express');
const validate = require('express-validation');
const commentValidations = require('../validations/comment-validate');
const { authorize } = require('../middlewares/auth');
const { update, deleteOne } = require('../controllers/comment-controller');

const router = express.Router();

router
  .route('/:id')
  .put(validate(commentValidations.update), authorize(), update)
  .delete(validate(commentValidations.deleteOne), authorize(), deleteOne);

module.exports = router;
