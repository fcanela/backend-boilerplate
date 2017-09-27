'use strict';

const jwt  = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = function generateToken(payload, expiresInSeconds, signKey, cipherKey) {
  if (!payload || !expiresInSeconds || !signKey || !cipherKey) {
    throw new Error('Invalid arguments: required (payload, expiresInSeconds, signKey, cipherKey)');
  }

  const jwtToken = jwt.sign({
    data: payload
  }, signKey, { expiresIn: expiresInSeconds });

  const cipher = crypto.createCipher('aes192', cipherKey);
  let encrypted = cipher.update(jwtToken, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return [ null, encrypted ];
};
