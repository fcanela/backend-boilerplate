'use strict';

const { normalize, join } = require('path');

const logger = require('chorizo').for('setup-routes');

const recursePath = require('../lib/recurse_path');
const importExtension = require('../lib/import_extension');
const createSchemaMiddleware = require('../lib/schema_validation_middleware');

function goRequire() {
  try {
    const result = require.apply(this, arguments);
    return [ null, result ];
  } catch(err) {
    return [ err ];
  }
}

async function injectDepsToRoute(routeFn, models) {
  try {
    let route = await routeFn(models);
    return [ null, route ];
  } catch(err) {
    return [ err ] ;
  }
}

function useMiddleware(router, method, resource, middleware) {
  try {
    router[method.toLowerCase()](resource, middleware);
    return [ null ];
  } catch(err) {
    return [ err ];
  }
}

async function configureSchemaCheck(path, route) {
  const [ importBodyErr, bodySchema ] = importExtension(path, 'body.schema');
  if (importBodyErr) {
    logger.error('Error importing body schema for route ' + path);
    return [ importBodyErr ];
  }

  const [ importQueryErr, querySchema ] = importExtension(path, 'query.schema');
  if (importQueryErr) {
    logger.error('Error importing query schema for route ' + path);
    return [ importQueryErr ];
  }

  if (!bodySchema && !querySchema) {
    return [ null, null ];
  }

  const [ createErr, middleware ] = createSchemaMiddleware(bodySchema, querySchema);
  if (createErr) {
    logger.error('Error creating schema validation middleware for ' + path);
    return [ createErr ];
  }
    return [ null, middleware ];
}

async function configureRoute(router, route) {
  try {
    const { method, resource, controller } = route;


    router[method.toLowerCase()](resource, async function controlErrorWrapper(req, res, next) {
      const logger = require('chorizo').for('routes-error-handler');
      try {
        await controller(req, res, next);
      } catch(err) {
        logger.error(`Uncaught error in ${method.toUpperCase()} ${resource}`, err);
        res.status(500).json();
      }
    });

    return [ null ];
  } catch(err) {
    return [ err ] ;
  }
}

module.exports = async function configureRoutes(models) {
  const router = require('express').Router();

  const path = normalize(join(__dirname, '..', 'routes'));
  logger.info('Looking for routes in ' + path);
  let [readDirErr, files] = await recursePath(path, /\.route\.js$/);
  if (readDirErr) {
    logger.error('Unable to enumerate routes in ' + path);
    return [ readDirErr ];
  }

  logger.info(`Found ${files.length} route files. Starting routes configuration`);
  for (let idx in files) {
    let fullpath = files[idx];
    let [ importErr, routeFn ] = goRequire(fullpath);
    if (importErr) {
      logger.error('Error importing route ' + fullpath);
      return [ importErr ];
    }

    let [ injectErr, route ] = await injectDepsToRoute(routeFn, models);
    if (injectErr) {
      logger.error('Error extracting parameters from route ' + fullpath);
      return [ configureErr ];
    }

      let [ schemaErr, schemaMiddleware ] = await configureSchemaCheck(fullpath, route);
    if (schemaErr) return [ schemaErr ];
    if (schemaMiddleware) {
      let [ insertSchemaErr ] = useMiddleware(router, route.method, route.resource, schemaMiddleware);
      if (insertSchemaErr) return [ insertSchemaErr ];
    }

    let [ configureErr ] = await configureRoute(router, route);
    if (configureErr) {
      logger.error('Error configuring route ' + fullpath);
      return [ configureErr ];
    }
  }

  return [ null , router];
};
