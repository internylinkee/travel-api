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
  .post(upload.array('images', 10), authorize(), uploadControllers.upload);

module.exports = router;
