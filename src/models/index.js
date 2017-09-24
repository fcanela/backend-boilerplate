'use strict';

const fs = require('fs');

module.exports = async function setUpModels(db) {
  function readdirAsync(path) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, function(err, files) {
        err ? reject([err, null]) : resolve([null, files]);
      });
    });
  }

  const [err, files] = await readdirAsync(__dirname);
  if (err) return [err, null];

  const models = {};
  let file;

  for (let i=0; i<files.length; i++) {
    try {
      file = files[i];
      if (!/.+\.model\.js$/.test(file)) continue;

      let fullpath = __dirname + '/' + file;
      let model = require(fullpath);
      let modelName = file.split('.model.js')[0];
      models[modelName] = await model.define(db);
    } catch(err) {
      return [err, null]s;
    }
  }

  return [null, model];
};
