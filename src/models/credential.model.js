'use strict';

const hashes = require('../lib/hashes');
const debug = require('debug')('service-models-credential');


exports.name = 'credential';
exports.define = function defineModel(db, models) {
  const userTable = 'user';
  const userCredentialsTable = 'user_credential';

  const logger = require('chorizo').for(exports.name + '-model');

  return {
    findById: async function findCredentialsById(id) {
      const results = await db(userCredentialsTable).where({ id }).select();

      if (results.length < 1) {
        return [ 'NOT_FOUND' ];
      }

      return [ null, results[0] ];
    },

    exists: async function exists(id) {
      const result = await this.findById(id) !== null;
      return [ null, result ];
    },

    create: async function create(data) {
      const credential = {
        id: data.id,
        hashVersion: data.hashVersion ? data.hashVersion : 'bcrypt',
        hash: data.hash ? data.hash : await hashes.bcrypt.hash(data.password, 10)
      };

      await db(userCredentialsTable).insert(credential);

      return [ null ];
    },

    verify: async function verifyCredentials(id, password) {
      const credentials = await this.findById(id);

      if (credentials === null) {
        return [ 'NOT_FOUND' ];
      }

      let verify = require('../lib/hashes').bcrypt.verify;

      const result = verify(password, credentials.hash);
      return [ null, result ];
    }
  };
};
