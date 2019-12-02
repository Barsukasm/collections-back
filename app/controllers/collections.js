const shortid = require('shortid');
const { validate } = require('jsonschema');
const db = require('../db/db');

const getCollections = (req, res, next) => {
  try {
    const collections = db.get('collections');
    res.json({ status: 'OK', data: collections });
  } catch (error) {
    throw new Error(error);
  }
};

const getCollection = (req, res, next) => {
  const { collectionId } = req.params;
  try {
    const collection = db.get('collections').find({ id: collectionId });
    res.json({ status: 'OK', data: collection });
  } catch (error) {
    throw new Error(error);
  }
};

const createCollection = (req, res, next) => {
  const collectionSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      items: { type: 'array' }
    },
    required: ['name', 'description', 'items'],
    additionalProperties: false
  };

  const validationResult = validate(req.body, collectionSchema);
  if (!validationResult.valid) {
    throw new Error('INVALID_JSON_OR_API_FORMAT');
  }

  const { name, description, items } = req.body;

  const collection = {
    id: shortid.generate(),
    name,
    description,
    items
  };

  try {
    db.get('collections')
      .push(collection)
      .write();
    res.json({
      status: 'OK',
      data: collection
    });
  } catch (error) {
    throw new Error(error);
  }
};

const editCollection = (req, res, next) => {
  const { collectionId } = req.params;
  try {
    const editedCollection = db
      .get('collections')
      .find({ id: collectionId })
      .assign(req.body)
      .value();

    db.write();
    res.json({
      status: 'OK',
      data: editedCollection
    });
  } catch (e) {
    throw new Error(e);
  }
};

const removeCollection = (req, res, next) => {
  const { collectionId } = req.params;
  try {
    db.get('collections')
      .remove({ id: collectionId })
      .write();
    res.json({ status: 'OK' });
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getCollections,
  getCollection,
  createCollection,
  editCollection,
  removeCollection
};
