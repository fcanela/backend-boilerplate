'use strict';

const express = require('express');
const bodyParser = require('body-parser');


module.exports = function configureExpress(app) {
  function configureCORS(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
      return res.status(httpStatus.NO_CONTENT).json();
    }

    next();
  }

  /* eslint-disable no-unused-vars */
  function errorHandler(err, req, es, next) {
    /* eslint-enable no-unused-vars */
    const errorMessage = err.stack.split('\n')[0];
    if (err) res.status(err.status).json({ message: errorMessage });
  }

  try {
    const app = express();

    app.enable('trust proxy');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.disable('x-powered-by');

    app.use(configureCORS);
    app.use(errorHandler);

    return [ null, app ];
  } catch(err) {
    return [ err ];
  }
};
