'use strict';

module.exports = async function configureGracefulExit() {
  const logger = require('chorizo').for('graceful-exit');

  process.on('unhandledRejection', function(reason, p){
    logger.fatal('Unhandled Promise Rejection. Reason: ' + reason);
  });

  process.on('uncaughtException', function(err) {
    logger.fatal('Uncaught Exception. ' + err);
  });
}
