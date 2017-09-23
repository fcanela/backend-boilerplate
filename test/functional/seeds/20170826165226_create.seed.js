'use strict';

const getSeedsUtils = require('../utils').getSeedsUtils;

exports.up = async function() {
  const utils = await getSeedsUtils();
  const storage = utils.storage;
  const random = utils.random;

  let estate;

  estate = random.estate();
  storage.push('/create/basicEstate1/fixture', estate);

  estate = random.estate(['price', 'number', 'latitude', 'longitude']);
  storage.push('/create/completeEstate1/fixture', estate);
};

exports.down = async function() {
};

