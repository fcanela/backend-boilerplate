'use strict';

const jwt  = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = function verifyToken(token, signKey, cipherKey) {
  if (!token || !signKey || !cipherKey) {
    throw new Error('Invalid arguments: required (token, signKey, cipherKey)');
  }
  try {
    const decipher = crypto.createDecipher('aes192', cipherKey);
    let decrypted = decipher.update(token, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    const decoded = jwt.verify(decrypted, signKey);
    return [ null, decoded.data ];
  } catch (err) {
    return [ err ];
  }
};
