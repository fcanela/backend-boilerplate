'use strict';

const resolveDBUtils = require('./db');

async function getCommonUtils() {
  const utils = await resolveDBUtils();
  utils.storage = require('./seeds_data_storage');
  return utils;
};

exports.getSeedsUtils = async function() {
  const utils = await getCommonUtils();
  const [ fakeErr, fake ] = await require('./fake')();
  if (fakeErr) throw fakeErr;

  utils.fake = fake;

  return utils;
};

exports.getTestsUtils = async function() {
  const utils = await getCommonUtils();
  utils.Client = require('./client');
  return utils;
};
