const express = require('express');
const itemsController = require('../controllers/items');

const router = express.Router();

router.get('/', itemsController.getItems);

router.get('/:itemId', itemsController.getItem);

router.post('/', itemsController.createItem);

router.patch('/:itemId', itemsController.editItem);

router.delete('/:itemId', itemsController.deleteItem);

module.exports = router;
