'use strict';

const tableName = 'estate';

exports.up = async function(db) {
  await db.schema.createTable(tableName, function(table) {
    // Ids
    table.bigIncrements('id').primary();
    table.bigInteger('userId').notNullable;

    // Human location
    table.string('postalCode', 5).notNullable;
    table.string('provinceId').notNullable;
    table.string('provinceTitle');
    table.string('municipalityId').notNullable;
    table.string('municipalyTitle');
    table.string('townId').notNullable;
    table.string('townTitle');
    table.string('street', 400).notNullable;
    table.string('number').unsigned().notNullable;

    // Map location
    table.float('latitude');
    table.float('longitude');
    table.specificType('location', 'GEOMETRY(POINT, 4326)'); // for PostGIS

    // Others
    table.string('type', 30).notNullable;
    table.string('operation', 30).notNullable;
    table.text('description');
    table.decimal('price').unsigned();
    table.boolean('isListed').notNullable;

    table.timestamp('createdAt').defaultsTo(db.fn.now());
  });
};

exports.down = async function(db) {
  await db.schema.dropTable(tableName);
};
