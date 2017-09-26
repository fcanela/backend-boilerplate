'use strict';

const { normalize, join } = require('path');

const logger = require('chorizo').for('setup-models');
const recursePath = require('../lib/recurse_path');

function goRequire() {
  try {
    const result = require.apply(this, arguments);
    return [ null, result ];
  } catch(err) {
    return [ err ];
  }
}

async function configure(modelDefinition, db) {
  try {
    const { name, define } = modelDefinition;
    const model = await define(db);
    return [ null, name, model ];
  } catch(err) {
    return [ err ] ;
  }
}

module.exports = async function configureModels(db) {
  const models = {};

  const path = normalize(join(__dirname, '..', 'models'));
  logger.info('Looking for models in ' + path);
  let [readDirErr, files] = await recursePath(path, /.model.js$/);
  if (readDirErr) {
    logger.error('Unable to enumerate models in ' + path);
    return readDirErr;
  }

  logger.info(`Found ${files.length} model files. Starting models configuration`);
  for (let idx in files) {
    let fullpath = files[idx];
    let [ importErr, modelDefinition ] = goRequire(fullpath);
    if (importErr) {
      logger.error('Error importing model ' + fullpath);
      return [ importErr ];
    }

    let [ configureErr, name, model ] = await configure(modelDefinition, db);
    if (configureErr) {
      logger.error('Error configuring model ' + fullpath);
      return [ configureErr ];
    }
    models[name] = model;
  }

  return [ null , models];
};
