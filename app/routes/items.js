const express = require('express');

const router = express.Router();

const controls = require('../controllers/items');

router.get('/', controls.getItems);

module.exports = router;