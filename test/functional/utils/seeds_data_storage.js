'use strict';

const NodeJsonDb = require('node-json-db');
const db = new NodeJsonDb(__dirname + '../seeds/data.tmp', true, false);

const storage = {
  put: db.push.bind(db),
  get: function(path) {
    const value = db.getData(path);
    return (typeof value === 'object') ? JSON.parse(JSON.stringify(value)) : value;
  }
};

module.exports = storage;
