'use strict';

const getSeedsUtils = require('../utils').getSeedsUtils;

exports.up = async function(db) {
  const { storage, models, fake } = await getSeedsUtils();

  // TODO: Change fake name
  const fixture = fake.changeme();
  // TODO: Insert data using raw db or models
  const id = await db('changeme').insert(fixture).returning('id');
  // TODO: Change stored data and path
  storage.put('/{{name}}/testname/id', id);
};

exports.down = async function(db) {
};

