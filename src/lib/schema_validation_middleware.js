'use strict';

const Ajv = require('ajv');
const httpStatus = require('http-status');

const logger = require('chorizo').for('schema-validation');

function createValidator(ajv, schema) {
  try {
    const validate = ajv.compile(schema);
    return [ null, validate ];
  } catch (err) {
    return [ err ];
  }
}

function respond(res, error) {
  res.status(400).json({
    error: {
      code: 'SCHEMA',
      details: error
    }
  });
}

module.exports = function generateMiddleware(bodySchema, querySchema) {
  const ajv = new Ajv();

  if (bodySchema) {
    var [ compileBodyErr, validateBody ] = createValidator(ajv, bodySchema);
    if (compileBodyErr) {
      logger.error('Unable to compile body schema');
      return [ compileBodyErr ];
    }
  }

  if (querySchema) {
    var [ compileQueryErr, validateQuery ] = createValidator(ajv, querySchema);
    if (compileQueryErr) {
      logger.error('Unable to compile query schema');
      return [ compileQueryErr ];
    }
  }

  return [ null, schemaValidationMiddleware ];

  function schemaValidationMiddleware(req, res, next) {
    if (!querySchema && !bodySchema) return next();

    if (bodySchema) {
      if (!validateBody(req.body)) {
        logger.warn(`Invalid body sent to ${req.method} ${req.url}: ${JSON.stringify(validateBody.errors)}`);
        return respond(res, validateBody.errors);
      }
    }

    if (querySchema) {
      if (!validateBody(req.query)) {
        logger.warn(`Invalid query sent to ${req.method} ${req.url}: ${JSON.stringify(validateQuery.errors)}`);
        return respond(res, validateQuery.errors);
      }
    }

    next();
  }
};
