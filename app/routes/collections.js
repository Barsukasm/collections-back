const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const collectionsController = require('../controllers/collections');

const router = express.Router();
const itemsRouter = require('./items');

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const st = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${shortid.generate()}${file.originalname}`);
  }
});

const upload = multer({
  storage: st,
  fileFilter: filter
});

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

router.post(
  '/',
  upload.single('collection-cover'),
  collectionsController.createCollection
);

router.patch(
  '/:collectionId',
  upload.single('collection-cover'),
  collectionsController.editCollection
);

router.delete('/:collectionId', collectionsController.removeCollection);

module.exports = router;
