'use strict';

module.exports = function configureRoute(models) {
  const route = {};

  const logger = require('chorizo').for('user-register');

  route.method = 'POST';
  route.resource = '/users';
  route.controller = async function(req, res) {
    const body = req.body;

    const [ existsErr, exists ] = await models.user.exists(body.email);
    if (exists) {
      logger.warn('Email is already registered: ' + body.email);
      return res.status(201).json({
        error: 'EMAIL_ALREADY_REGISTERED'
      });
    }

    const userProperties = Object.assign({}, body);
    delete userProperties.password;
    const [ newUserErr, newUser ] = await models.user.create(userProperties);
    const replyBody = Object.assign({}, newUser);

    const credentialProperties = {
      id: newUser.id,
      password: body.password,
      hash: body.hash
    };
    const [ credErr, credentials ] = await models.credential.create(credentialProperties);

    res.status(201).json(replyBody);
  };

  return route;
};
