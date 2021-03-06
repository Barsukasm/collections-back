const shortid = require('shortid');
const { validate } = require('jsonschema');
const fs = require('fs');
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
      description: { type: 'string' }
    },
    required: ['name', 'description'],
    additionalProperties: false
  };

  const validationResult = validate(req.body, collectionSchema);
  if (!validationResult.valid) {
    throw new Error('INVALID_JSON_OR_API_FORMAT');
  }

  const { name, description } = req.body;
  let path;
  if (req.file) {
    path = req.file.path;
  } else {
    path = '';
  }

  const collection = {
    id: shortid.generate(),
    name,
    description,
    items: [],
    path
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
  const { name, description, removeImage: removeImageString } = req.body;

  const removeImage = removeImageString !== 'false';

  const collection = db.get('collections');
  let { path } = collection.find({ id: collectionId }).value();
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

  try {
    const editedCollection = db
      .get('collections')
      .find({ id: collectionId })
      .assign({ name, description, path })
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
    const collection = db.get('collections');
    const { path } = collection.find({ id: collectionId }).value();
    if (path !== '') {
      fs.unlink(path, (err) => {
        if (err) throw err;
      });
    }

    collection.remove({ id: collectionId }).write();
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
