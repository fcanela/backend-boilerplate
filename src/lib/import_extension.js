'use strict';

const fs = require('fs');

module.exports = function importExtension(fullpath, extensionName) {
  const extensionPath = fullpath.replace(/route\.js$/, extensionName) + '.js';

  if (!fs.existsSync(extensionPath)) {
    return [ null, null ];
  }

  try {
    const content = require(extensionPath);
    return [ null, content ];
  } catch (err) {
    return [ err ];
  }
}
