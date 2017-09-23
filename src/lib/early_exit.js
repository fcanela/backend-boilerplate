'use strict';

module.exports = function() {
  process.on('uncaughtException', function(err) {
    const now = (new Date()).toUTCString();
    console.error(now + ' uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
  });
};
