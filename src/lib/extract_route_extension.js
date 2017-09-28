'use strict';

const fs = require('fs');

module.exports = function extractRouteExtension(path, extension) {
  const basePath = path.replace(/route\.js$/, '');
  const result = {
    body: null,
    schema: null
  };

  const targetFile = basePath + extension;
  if (fs.existsSync(targetFile)) {
    try {
      const content = require(targetFile);
      return [ null, content ];
    } catch(err) {
      return [ err ];
    }
  }
}
