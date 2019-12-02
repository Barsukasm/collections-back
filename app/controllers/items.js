const shortid = require('shortid');
const { validate } = require('jsonschema');
const db = require('../db/db');

const getItems = (req, res, next) => {
  const { collectionId } = req.params;
  try {
    const items = db.get('collections')
      .find({ id: collectionId })
      .get('items');
    res.json({ status: 'OK', data: items });
  } catch (e) {
    throw new Error(e);
  }
};

const getItem = (req, res, next) => {
  const { collectionId, itemId } = req.params;
  try {
    const item = db.get('collections')
      .find({ id: collectionId })
      .get('items')
      .find({ id: itemId });
    res.json({ status: 'OK', data: item });
  } catch (e) {
    throw new Error(e);
  }
};

const createItem = (req, res, next) => {
  const { collectionId } = req.params;
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

  const validationResult = validate(req.body, itemSchema);
  if (!validationResult.valid) {
    throw new Error('INVALID_JSON_OR_API_FORMAT');
  }

  const { name, description, owned } = req.body;

  const item = {
    id: shortid.generate(),
    name,
    description,
    owned
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
  const { collectionId, itemId } = req.params;
  try {
    const editedItem = db.get('collections')
      .find({ id: collectionId })
      .get('items')
      .find({ id: itemId })
      .assign(req.body)
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
  const { collectionId, itemId } = req.params;
  try {
    db.get('collections')
      .find({ id: collectionId })
      .get('items')
      .remove({ id: itemId })
      .write();
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
