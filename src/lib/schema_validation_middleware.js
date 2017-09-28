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

function respond(res, ajv) {
  res.status(400).json({
    error: {
      code: 'SCHEMA',
      description: ajv.errorsText()
    }
  });
}

module.exports = function generateMiddleware(bodySchema, querySchema) {
  const ajv = new Ajv();

  if (bodySchema) {
    const [ compileBodyErr, validateBody ] = createValidator(ajv, bodySchema);
    if (compileBodyErr) {
      logger.error('Unable to compile body schema');
      return [ compileBodyErr ];
    }
  }

  if (querySchema) {
    const [ compileQueryErr, validateQuery ] = createValidator(ajv, querySchema);
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
        logger.warn(`Invalid body sent to ${req.method} ${req.url}: ${ajv.errorsText}`);
        return respond(res, ajv);
      }
    }

    if (querySchema) {
      if (!validateBody(req.query)) {
        logger.warn(`Invalid body sent to ${req.method} ${req.url}: ${ajv.errorsText}`);
        return respond(res, ajv);
      }
    }

    next();
  }
};
