'use strict';

const knex = require('knex');

module.exports = async function configureDB() {
  let db;

  try {
    const configuration = require('../db/configuration');
    db = knex(configuration);
    await db.raw('select 1 as testDBUp');
  } catch(err) {
    return [err, null];
  }

  return [null, db];
};
