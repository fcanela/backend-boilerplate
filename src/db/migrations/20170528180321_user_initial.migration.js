'use strict';

const tableName = 'user';

exports.up = async function(db) {
  await db.schema.createTable(tableName, function(table) {
    table.bigIncrements('id').primary();
    table.boolean('isAdmin').defaultsTo(false);
    table.string('email').unique();
    table.integer('phoneInternationalPrefix').unsigned();
    table.integer('phone').unsigned().unique();
    table.string('name').notNullable();
    table.string('surname');
    table.timestamp('createdAt').defaultsTo(db.fn.now());
  });
};

exports.down = async function(db) {
  await db.schema.dropTable(tableName);
};
