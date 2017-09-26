'use strict';

const { normalize, join } = require('path');

const logger = require('chorizo').for('setup-routes');
const recursePath = require('../lib/recurse_path');

function goRequire() {
  try {
    const result = require.apply(this, arguments);
    return [ null, result ];
  } catch(err) {
    return [ err ];
  }
}

async function configure(router, routeFn, models) {
  try {
    let route = await routeFn(models);
    let { method, resource, controller } = route;

    router[method.toLowerCase()](resource, controller);

    return [ null ];
  } catch(err) {
    return [ err ] ;
  }
}

module.exports = async function configureRoutes(models) {
  const router = require('express').Router();

  const path = normalize(join(__dirname, '..', 'routes'));
  logger.info('Looking for routes in ' + path);
  let [readDirErr, files] = await recursePath(path, /.route.js$/);
  if (readDirErr) {
    logger.error('Unable to enumerate routes in ' + path);
    return readDirErr;
  }

  logger.info(`Found ${files.length} route files. Starting routes configuration`);
  for (let idx in files) {
    let fullpath = files[idx];
    let [ importErr, routeFn ] = goRequire(fullpath);
    if (importErr) {
      logger.error('Error importing route ' + fullpath);
      return [ importErr ];
    }

    let [ configureErr ] = await configure(router, routeFn, models);
    if (configureErr) {
      logger.error('Error configuring route ' + fullpath);
      return [ configureErr ];
    }
  }

  return [ null , router];
};
