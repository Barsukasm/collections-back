const shortid = require('shortid');
const { validate } = require('jsonschema');
const fs = require('fs');
const db = require('../db/db');

const getItems = (req, res, next) => {
  const { collectionId } = req;
  try {
    const items = db
      .get('collections')
      .find({ id: collectionId })
      .get('items');
    res.json({ status: 'OK', data: items });
  } catch (e) {
    throw new Error(e);
  }
};

const getItem = (req, res, next) => {
  const { collectionId } = req;
  const { itemId } = req.params;
  try {
    const item = db
      .get('collections')
      .find({ id: collectionId })
      .get('items')
      .find({ id: itemId });
    res.json({ status: 'OK', data: item });
  } catch (e) {
    throw new Error(e);
  }
};

const createItem = (req, res, next) => {
  const { collectionId } = req;
  console.log('CollectionId: ', collectionId);
  const itemSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      owned: { type: 'boolean' }
    },
    required: ['name', 'description'],
    additionalProperties: false
  };

  const { name, description, owned: ownedString } = req.body;
  const owned = ownedString !== 'false';
  const body = {
    name, description, owned
  };
  const validationResult = validate(body, itemSchema);
  if (!validationResult.valid) {
    throw new Error('INVALID_JSON_OR_API_FORMAT');
  }

  let path;
  if (req.file) {
    path = req.file.path;
  } else {
    path = '';
  }

  const item = {
    id: shortid.generate(),
    name,
    description,
    owned,
    path
  };

  try {
    db.get('collections')
      .find({ id: collectionId })
      .get('items')
      .push(item)
      .write();
  } catch (e) {
    throw new Error(e);
  }

  res.json({
    status: 'OK',
    data: item
  });
};

const editItem = (req, res, next) => {
  const { collectionId } = req;
  const { itemId } = req.params;
  const {
    name, description, owned: ownedString, removeImage
  } = req.body;

  const owned = ownedString !== 'false';

  const item = db.get('collections').find({ id: collectionId }).get('items');
  let { path } = item.find({ id: itemId }).value();
  if (req.file) {
    if (path !== '' && path !== undefined) {
      fs.unlink(path, (err) => {
        if (err) throw err;
      });
    }
    path = req.file.path;
  } else if (removeImage) {
    if (path !== '' && path !== undefined) {
      fs.unlink(path, (err) => {
        if (err) throw err;
      });
      path = '';
    }
  }

  const newItem = {
    name,
    description,
    owned,
    path
  };


  try {
    const editedItem = db
      .get('collections')
      .find({ id: collectionId })
      .get('items')
      .find({ id: itemId })
      .assign(newItem)
      .value();

    db.write();
    res.json({
      status: 'OK',
      data: editedItem
    });
  } catch (e) {
    throw new Error(e);
  }
};

const deleteItem = (req, res, next) => {
  const { collectionId } = req;
  const { itemId } = req.params;
  try {
    const items = db.get('collections')
      .find({ id: collectionId })
      .get('items');

    const { path } = items.find({ id: itemId }).value();
    if (path !== '') {
      fs.unlink(path, (err) => {
        if (err) throw err;
      });
    }

    items.remove({ id: itemId }).write();
    res.json({ status: 'OK' });
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getItems,
  getItem,
  createItem,
  editItem,
  deleteItem
};
