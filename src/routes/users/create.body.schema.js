'use strict';

module.exports = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'email', 'password'],
  properties: {
    name: {
      type: 'string'
    },
    surname: {
      type: 'string'
    },
    phone: {
      type: 'integer'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  }
}
