'use strict';

const knex = require('knex');

const srcPath = require('path').normalize(__dirname + '/../../../src');
const setUpDB = require(srcPath + '/startup/db');
const setUpModels = require(srcPath + '/startup/models');

let cachedResponse;

module.exports = async function resolveDBUtils() {
  if (!cachedResponse) {
    cachedResponse = {};

    const [dbErr, db] = await setUpDB();
    if (dbErr) throw dbErr;
    cachedResponse.db = db;

    const [modelsErr, models] = await setUpModels(db);
    if (modelsErr) throw modelsErr;
    cachedResponse.models = models;
  }

  return cachedResponse;
};
