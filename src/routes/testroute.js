'use strict';

module.exports = function configureRoute(models) {
  const route = {};

  route.method = 'GET';
  route.resource = '/test';
  route.controller = function(req, res) {
    res.json({ it: 'works!'});
  };

  return route;
};
