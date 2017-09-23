'use strict';

const promise = init();
module.exports = promise;

async function init() {
  const logger = require('chorizo').for('init');

  // Set up graceful exit
  const configureGracefulExit = require('./startup/graceful_exit');
  configureGracefulExit();

  // Set default node environment to development
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  const env = process.env.NODE_ENV;

  // Setup database
  const configureDB = require('./startup/db');
  let [dbErr, db] = await configureDB();
  if (dbErr) logger.fatal('Unable to set up database');
  logger.info('Database configured');

  // Setup models
  let [modelsErr, models] = await require('./models')(db);
  if (modelsErr) logger.fatal('Unable to set up models');
  logger.info('Model configured');

  // Setup express
  const configureExpress = require('./express');
  let [serverErr, app] = await configureExpress();
  if (serverErr) logger.fatal('Unable to set up server');
  logger.info('Server configured');

  /*
  // TODO: API routes and controllers
  const configureRoutes = require('./routes')
  let [routesErr, routes] = configureRoutes(models, logger, dependency);
  if (routesErr) logger.fatal('Unable to set up routes');
  logger.info('Routes configured');
  */

  // Create server
  let host = process.env.HOST || '0.0.0.0';
  let port = process.env.PORT || 9000;
  const server = app.listen(port, host, function serverListen() {
    host = server.address().address;
    port = server.address().port;
    logger.info('App listening at http://' + host + ':' + port,'in mode:', env);
  });

  return server;
}
