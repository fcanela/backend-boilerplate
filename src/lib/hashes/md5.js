'use strict';

const crypto = require('crypto');

exports.hash = function hash(password) {
  return crypto.createHash('md5').update(password).digest('hex');
};

exports.verify = function verify(password, expectedHash) {
  const passwordHash = exports.hash(password);
  return passwordHash === expectedHash;
};
