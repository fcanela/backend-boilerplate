'use strict';

module.exports = function configureRoute(models) {
  const route = {};

  route.method: 'POST',
  route.resource: '/lololo',
  route.controller: function(req, res) {
    res.json({ it: 'works!'});
  }
};
