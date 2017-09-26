'use strict';

const { normalize, join } = require('path');
const { readdir, lstat } = require('./promised_fs');

async function recurse(path, regex, results) {
  const [ readErr, content ] = await readdir(path);
  if (readErr) return [ readErr ];

  for (let idx in content) {
    let name = content[idx];
    let fullpath = normalize(join(path, name));

    const [ statsErr, stats] = await lstat(fullpath);
    if (statsErr) return [ statsErr ];

    if (stats.isDirectory()) {
      let [ err ] = recurse(fullpath, regexes, handler);
      if (err) return [ err ];
    }

    if (!regex.test(name)) continue;
    results.push(fullpath);
  }

  return [ null, results ];
}

module.exports = async function recursePath(path, regex) {
  return recurse(path, regex, []);
};
