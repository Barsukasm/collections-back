const express = require('express');

const router = express.Router();

router.get('/:collectionId');

router.get('/', (req, res, next) => {
    console.log(req.baseUrl.slice(1));
    res.json(req.baseUrl.slice(1));
});

module.exports = router;