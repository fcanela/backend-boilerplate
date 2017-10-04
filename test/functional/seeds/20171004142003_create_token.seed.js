'use strict';

const getSeedsUtils = require('../utils').getSeedsUtils;

exports.up = async function(db) {
  const { storage, models, fake } = await getSeedsUtils();

  let fixture = fake.user();
  const [ err, user ] = await models.user.create(fixture);

  const credential = {
    id: user.id,
    password: '1234'
  };

  await models.credential.create(credential);

  storage.put('/create_token/validCase/credential', {
    email: user.email,
    password: credential.password
  });
};

exports.down = async function(db) {
};

