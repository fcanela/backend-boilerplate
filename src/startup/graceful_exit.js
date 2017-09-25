'use strict';

let httpServer;
let knex;

function GracefulExitManager(opts={}) {
  this.logger = require('chorizo').for('graceful-exit');

  // Waiting in seconds before forcing application exit
  this.waitingTimeout = (opts.waitingTimeout || 5);
}

const proto = GracefulExitManager.prototype;
module.exports = GracefulExitManager;

function createShutdownHandler(self) {
  function niceExit() {
    process.exit();
    setTimeout(bruteExit, 1*1000);
  }

  function bruteExit() {
    process.kill(process.pid, 'SIGKILL');
  }


  return function() {
    const timeout = self.waitingTimeout;
    const message = `Finishing application execution. Waiting ${timeout} seconds for graceful exit`;
    self.logger.info(message);

    setTimeout(niceExit, timeout*1000);

    if (!self.httpServer) return process.exit();

    self.logger.info('Stopping HTTP Server and finishing current requests');
    self.httpServer.close(async function() {
      if (!self.knex) return process.exit();

      self.logger.info('Closing database connections');
      await self.knex.client.pool.drain();
      self.knex.client.pool.clear();

      process.exit();
    });
  };
}

proto.configure = function() {
  const self = this;
  const logger = this.logger;

  process.on('SIGTERM', createShutdownHandler(this));
  process.on('SIGINT', createShutdownHandler(this));
  require('chorizo').once('fatal', function() {
    logger.info('Proceding to graceful exit after fatal error');
    process.exitCode = 1;
    const handler = createShutdownHandler(self);
    handler();
  });

  process.on('unhandledRejection', function(reason, p){
    logger.fatal('Unhandled Promise Rejection. Reason: ' + reason);
    logger.info('Proceding to graceful exit after an unhandled promise');
    process.exitCode = 1;
    process.kill(process.pid, 'SIGTERM');
  });

  process.on('uncaughtException', function(err) {
    logger.fatal('Uncaught Exception. ' + err);
    logger.info('Proceding to graceful exit after an uncaught exception');
    process.exitCode = 1;
    process.kill(process.pid, 'SIGTERM');
  });
};
