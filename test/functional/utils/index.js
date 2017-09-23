'use strict';

const resolveDBUtils = require('./db');

async function getCommonUtils() {
  const utils = await resolveDBUtils();
  utils.storage = require('./seeds_data_storage');
  return utils;
}

exports.getSeedsUtils = async function() {
  const utils = await getCommonUtils();
  utils.random = require('./fake');
  return utils;
};

exports.getTestsUtils = async function() {
  const utils = await getCommonUtils();
  utils.getService = require('./service').getService;
  return utils;
};
