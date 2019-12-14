const express = require('express');
const multer = require('multer');
const collectionsController = require('../controllers/collections');

const router = express.Router();
const itemsRouter = require('./items');

const upload = multer({ dest: 'uploads/' });

router.use(
  '/:collectionId/items',
  (req, res, next) => {
    req.collectionId = req.params.collectionId;
    next();
  },
  itemsRouter
);

router.get('/', collectionsController.getCollections);

router.get('/:collectionId', collectionsController.getCollection);

router.post('/', upload.single('collection-cover'), collectionsController.createCollection);

router.patch('/:collectionId', collectionsController.editCollection);

router.delete('/:collectionId', collectionsController.removeCollection);

module.exports = router;
