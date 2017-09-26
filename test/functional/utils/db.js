'use strict';

const knex = require('knex');

const srcPath = require('path').normalize(__dirname + '/../../../src');
const getDBConfiguration = require(srcPath + '/db/configuration');
const setUpModels = require(srcPath + '/startup/models');

let cachedResponse;

module.exports = async function resolveDBUtils() {
  if (!cachedResponse) {
    cachedResponse = {};
    const configuration = getDBConfiguration();
    cachedResponse.db = await knex(configuration);
    const [err, models] = await setUpModels(cachedResponse.db);
    cachedResponse.models = models;
  }

  return cachedResponse;
};
