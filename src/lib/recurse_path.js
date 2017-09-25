'use strict';

  const { normalize, join } = require('path');
  const { readdir, lstat } = require('./promised_fs');

/*
    if (name.indexOf('.js') > -1 && !isIgnored(name)) {
      fullpath = fullpath.replace('.js', '');

      let controller = require(fullpath)(models, logger, errorHandler);
      loadController(controller, fullpath);
    }
*/

async function recurse(path, regex, results) {
  const [ readErr, content ] = await readdir(dir);
  if (readErr) return readErr;

  for (let idx in content) {
    let name = content[idx];
    let fullpath = normalize(join(dir, name));
    let stats = await lstat(fullpath);

    if (stats.isDirectory(fullpath)) {
      let [ err ] = recurse(fullpath, regexes, handler);
      if (err) return [ err ];
    }

    if (!regex.test(name)) continue;
    results.push(fullpath);
  }
}

module.exports = async function recursePath(path, regex) {
  return recurse(path, regex, []);
};
