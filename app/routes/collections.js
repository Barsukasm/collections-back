const express = require('express');

const router = express.Router();

const itemRoutes = require('./items');

router.use('/:collectionId', itemRoutes);

router.get('/:collectionId');

router.get('/', (req, res, next) => {
    console.log(req.baseUrl.slice(1));
    res.json(req.baseUrl.slice(1));
});

module.exports = router;