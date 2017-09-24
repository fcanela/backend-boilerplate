'use strict';

let httpServer;
let knex;

function GracefulExitManager() {
  this.logger = require('chorizo').for('graceful-exit');

  const self = this;

  process.on('unhandledRejection', function(reason, p){
    logger.fatal('Unhandled Promise Rejection. Reason: ' + reason);
    self.handleShutdown();
  });

  process.on('uncaughtException', function(err) {
    logger.fatal('Uncaught Exception. ' + err);
    self.handleShutdown();
  });
}

const proto = GracefulExitManager.prototype;

proto._handleShutdown = function() {
  if (this.httpServer) {
    this.httpServer.close(function() {
      this.knex.client.pool.destroy();
    });
  }
};

module.exports = GracefulExitManager;

