'use strict';

const httpStatus = require('http-status');

const generateToken = require('../../lib/tokens').generate;

module.exports = function configureRoute(models) {
  const route = {};

  const logger = require('chorizo').for('create-token');

  route.method = 'post';
  route.resource = '/tokens';
  route.controller = async function(req, res) {
    const body = req.body;

    const [ existsErr, user ] = await models.user.findByEmail(body.email);
    if (!user) {
      logger.warn('Unregistered email login: ' + body.email);
      return res.status(httpStatus.UNAUTHORIZED).json();
    }

    const [ verifyErr, valid ] = await models.credential.verify(user.id, body.password);
    if (!valid) {
      logger.warn(`Invalid credentials for ${body.email} (User id: ${user.id})`);
      return res.status(httpStatus.UNAUTHORIZED).json();
    }

    const timeout = process.env.TOKEN_TIMEOUT_SECS || 2*60*60;
    const integritySecret = process.env.TOKEN_INTEGRITY_SECRET;
    const cipherSecret = process.env.TOKEN_CIPHER_SECRET;
    const tokenBody = body.email;

    const TOKEN_SECRET = 'foobar';
    const [ tokenErr, token ] = generateToken(tokenBody, timeout, integritySecret, cipherSecret);

    res.status(httpStatus.CREATED).json({ token });
    logger.info(`Created token for ${body.email} (User id: ${user.id})`);
  };

  return route;
};
