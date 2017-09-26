'use strict';

const bcrypt = require('bcrypt');

exports.hash = function hash(password) {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
  return bcrypt.hash(password, rounds);
};

exports.verify = function verify(password, hash) {
  return bcrypt.compare(password, hash);
};
