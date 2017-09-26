'use strict';

const logger = require('chorizo').for('init');

const promise = init().catch((err) => {
  logger.fatal('Something failed setting up the application', err);
  return err;
});

module.exports = promise;

async function init() {
  // Set up graceful exit
  const GracefulExitManager = require('./startup/graceful_exit');
  const gracefulExitManager = new GracefulExitManager();
  gracefulExitManager.configure();

  // Set default node environment to development
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  const env = process.env.NODE_ENV;

  // Setup database
  logger.info('Configuring database');
  const configureDB = require('./startup/db');
  const [dbErr, db] = await configureDB();
  if (dbErr) return logger.fatal('Unable to set up database', dbErr);
  gracefulExitManager.knex = db;

  // Setup models
  logger.info('Configuring models');
  const [modelsErr, models] = await require('./startup/models')(db);
  if (modelsErr) return logger.fatal('Unable to set up models', modelsErr);

  // Setup express
  logger.info('Configuring HTTP server');
  const configureExpress = require('./startup/express');
  const [serverErr, app] = await configureExpress();
  if (serverErr) return logger.fatal('Unable to set up server', serverErr);

  // API routes and controllers
  logger.info('Configuring routes');
  const configureRoutes = require('./startup/routes');
  const [routesErr, router] = await configureRoutes(models);
  app.use(router);
  if (routesErr) logger.fatal('Unable to set up routes', routesErr);

  // Create server
  let host = process.env.HOST || '0.0.0.0';
  let port = process.env.PORT || 9000;
  logger.info(`Making HTTP server start listening (${host}:${port})`);
  const server = app.listen(port, host, function serverListen() {
    host = server.address().address;
    port = server.address().port;
    logger.info(`Service listening at "http://${host}:${port}" in "${env}" mode`);
  });
  gracefulExitManager.httpServer = server;

  return server;
}
