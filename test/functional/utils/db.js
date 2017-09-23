'use strict';

const knex = require('knex');

const srcPath = require('path').normalize(__dirname + '/../../../src');
console.log('srcPath', srcPath);
const getDBConfiguration = require(srcPath + '/db/configuration');
const setUpModels = require(srcPath + '/models');

let cachedResponse;

module.exports = async function resolveDBUtils() {
  if (!cachedResponse) {
    cachedResponse = {};
    const configuration = getDBConfiguration();
    cachedResponse.db = await knex(configuration);
    cachedResponse.models = await setUpModels(cachedResponse.db);
  }

  return cachedResponse;
};
