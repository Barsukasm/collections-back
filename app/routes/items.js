const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const itemsController = require('../controllers/items');

const router = express.Router();

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const st = multer.diskStorage({
  destination: 'uploads/items/',
  filename: (req, file, cb) => {
    cb(null, `${shortid.generate()}${file.originalname}`);
  }
});

const upload = multer({
  storage: st,
  fileFilter: filter
});

router.get('/', itemsController.getItems);

router.get('/:itemId', itemsController.getItem);

router.post('/', upload.single('item-cover'), itemsController.createItem);

router.patch('/:itemId', upload.single('item-cover'), itemsController.editItem);

router.delete('/:itemId', itemsController.deleteItem);

module.exports = router;
