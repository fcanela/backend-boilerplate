'use strict';

const path = require('path');
const Router = require('express').Router;

const recursePath = require('../lib/recurse_path');

function goRequire() {
  try {
    const result = require.apply(this, arguments);
    return [ null, result ];
  } catch(err) {
    return [ err ];
  }
}

module.exports = async function configureRoutes(models) {
  const logger = require('chorizo').for('setup-routes');
  const router = Router();

  const path = path.normalize(path.join(__dirname, '..', 'routes'));
  logger.info('Looking for routes in ' + path);
  let [readDirErr, files] = await recursePath(path, /.route.js$/);
  if (readDirErr) {
    logger.error('Unable to enumerate routes in ' + path);
    return readDirErr;
  }

  for (let idx in files) {
    let fullpath = files[idx];
    let [ importErr, configureRoute ] = goRequire(fullpath);
    if (importErr) {
      logger.error('Error importing route ' + fullpath);
      return [ importError ]
    }

    let route = configureRoute(models);
    let { method, resource, controller } = route;
    route[method.toLowerCase()](resource, controller);
  }
};
