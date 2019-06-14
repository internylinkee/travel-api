const expresss = require('express');
const validate = require('express-validation');
const reviewControllers = require('../controllers/review-controller');
const reviewValidations = require('../validations/review-validate');
const { authorize } = require('../middlewares/auth');

const router = expresss.Router();

router
  .route('/')
  .post(
    validate(reviewValidations.create),
    authorize(),
    reviewControllers.create,
  );
router
  .route('/:id')
  .put(
    validate(reviewValidations.update),
    authorize(),
    reviewControllers.update,
  );

module.exports = router;
