'use strict';

const tableName = '{{name}}';

exports.up = async function(db) {
  await db.schema.createTable(tableName, function(table) {
    table.increments('id');

    table.timestamp('createdAt').defaultsTo(db.fn.now());
  });
};

exports.down = async function(db) {
  await db.schema.dropTable(tableName);
};
