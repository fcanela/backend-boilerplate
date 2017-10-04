'use strict';

const getSeedsUtils = require('../utils').getSeedsUtils;

exports.up = async function(db) {
  const { storage, models, fake } = await getSeedsUtils();

  const fixture = fake.user(['password']);
  storage.put('/createUser/user1/fixture', fixture);
};

exports.down = async function(db) {
};

