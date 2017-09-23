'use strict';

const getSeedsUtils = require('../utils').getSeedsUtils;

const tableName = 'tablename';

exports.up = async function(db) {
  const utils = await getSeedsUtils();
  const storage = utils.storage;
  const random = utils.random;
  const models = utils.models;


  let err;
  let estate;
  let estateData;

  estateData = random.estate();
  estateData.latitude = '-44.0084274';
  estateData.longitude = '170.4642818';
  [err, estate] = await models.estate.create(estateData);
  storage.push('/radialSearch/simpleSearch1/center', estate);

  estateData = random.estate();
  estateData.latitude = '-44.2598346';
  estateData.longitude = '170.0691891';
  [err, estate] = await models.estate.create(estateData);
  storage.push('/radialSearch/simpleSearch1/additional', estate);

  storage.push('/radialSearch/simpleSearch1/distance', 55*1000);
};

exports.down = async function() {
};
