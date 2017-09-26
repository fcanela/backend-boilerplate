'use strict';

const tableName = 'user_credential';

exports.up = async function(db) {
  await db.schema.createTable(tableName, function(table) {
    table.bigInteger('id');
    table.foreign('id').references('user.id');
    table.string('hashVersion').notNullable();
    table.string('hash').notNullable();

    table.timestamp('createdAt').defaultsTo(db.fn.now());
  });
};

exports.down = async function(db) {
  await db.schema.dropTable(tableName);
};
