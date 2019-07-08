const express = require('express');
const categoryControllers = require('../controllers/category-controller');

const router = express.Router();

router.get('/', categoryControllers.getList);

module.exports = router;
