'use strict';

const hashes = require('../lib/hashes');

exports.name = 'user';
exports.define = function defineModel(db, models) {
  const userTable = 'user';

  return {

    findByEmail: async function findByEmail(email) {
      const results = await db(userTable).where({
        email
      }).select();

      if (results < 1) {
        return [ 'NOT_FOUND' ];
      }

      return [ null, results[0] ];
    },

    exists: async function existsByEmail(email) {
      const [ err, user ] = await this.findByEmail(email);
      if (err) return [ err ];

      const result = user !== null;
      return [ null, result ];
    },

    create: async function create(properties) {
      const results = await db(userTable)
        .insert(properties)
        .returning(['id', 'email', 'phone', 'name', 'surname']);

      const user = results[0];

      return [ null, user ];
    }
  };

};
