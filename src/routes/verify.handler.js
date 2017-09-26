'use strict';

const Ajv = require('ajv');

module.exports = function verifyCredentialsListener(service, models) {
  const listener = {};

  listener.events = ['api.users.verify_credential_request'];

  const ajv = new Ajv();
  listener.handler = async function createUser(error, event) {
    const body = event.payload;

    let valid = ajv.validate(listener.bodySchema, body);
    if (!valid) {
      const meta = {
        error: {
          code: 'SCHEMA',
          details: ajv.errorsText()
        }
      };
      return service.reply(event, { valid: false }, meta);
    }

    const user = await models.user.findByEmail(body.email);
    if (!user) {
      const meta = {
        error: {
          code: 'EMAIL_NOT_REGISTERED',
        }
      };
      return service.reply(event, { valid: false }, meta);
    }

    valid = await models.credential.verify(user.id, body.password);
    if (!valid) {
      const meta = {
        error: {
          code: 'INVALID_PASSWORD',
        }
      };
      return service.reply(event, { valid: false }, meta);
    }

    service.reply(event, { valid });
  };

  listener.bodySchema = {
    required: ['email', 'password'],
    additionalProperties: false,
    properties: {
      email: {
        type: 'string',
        format: 'email' ,
      },
      password: {
        type: 'string',
        minLength: 8
      }
    }
  };

  return listener;
};
