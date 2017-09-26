'use strict';

const fs = require('fs');

module.exports = {
  readdir: async function readdir(path) {
    return new Promise((resolve) => {
      fs.readdir(path, function(err, content) {
        if (err) return resolve([err, null]);
        resolve([null, content]);
      });
    });
  },
  lstat: async function lstat(path) {
    return new Promise((resolve) => {
      fs.lstat(path, function(err, content) {
        if (err) return resolve([err, null]);
        resolve([null, content]);
      });
    });
  }
};
