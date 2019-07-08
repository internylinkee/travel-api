const express = require('express');
const locationControllers = require('../controllers/location-controller');

const router = express.Router();

router.get('/', locationControllers.getList);

module.exports = router;
