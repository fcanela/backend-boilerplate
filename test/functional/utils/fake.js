'use strict';

const { normalize, join } = require('path');

const srcPath = normalize(join(__dirname, '..', '..', '..', 'src'));
const recursePath = require(join(srcPath, 'lib', 'recurse_path'));

const logger = require('chorizo').for('setup-fakes');

function goRequire() {
  try {
    const result = require.apply(this, arguments);
    return [ null, result ];
  } catch(err) {
    return [ err ];
  }
}

async function configure(fake) {
  try {
    const { name, generate } = fake;
    if (!name) throw new Error('Undefined name property');
    if (!generate) throw new Error('Undefined generate property');
    return [ null, name, generate ];
  } catch(err) {
    return [ err ] ;
  }
}

module.exports = async function configureFakes() {
  const fakes = {};

  const path = normalize(join(__dirname, '..', 'fake'));
  let [readDirErr, files] = await recursePath(path, /\.fake\.js$/);
  if (readDirErr) {
    logger.fatal('Unable to read ' + path + ' directory');
    return [readDirErr];
  }

  for (let idx in files) {
    let fullpath = files[idx];
    let [ importErr, fake ] = goRequire(fullpath);
    if (importErr) {
      logger.fatal('Error while importing ' + fullpath);
      return [ importErr ];
    }

    let [ configureErr, name, generate ] = await configure(fake);
    if (configureErr) {
      logger.fatal('Error while configuring ' + fullpath);
      return [ configureErr ];
    }

    if (fakes[name]) return [ new Error(`A fake named ${name} already exists`) ];
    fakes[name] = generate;
  }

  return [ null , fakes];
};
