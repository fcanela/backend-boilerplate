'use strict';

const fs = require('fs');
const normalize = require('path').normalize;

function pad(date) {
  date = date.toString();
  return date[1] ? date : '0' + date;
}

function getTimestamp() {
  const now = new Date();
  return now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
}

function createSQLMigration(name) {
  const migrationsPath = normalize(__dirname + '/../src/db/migrations/');
  const timestamp = getTimestamp();
  const fileName = `${timestamp}_${name}.migration.js`;
  const path = migrationsPath + fileName;

  const content = `'use strict';

const tableName = '';

exports.up = async function(db) {
  await db.schema.createTable(tableName, function(table) {
    table.increments('id');

    table.timestamp('createdAt').defaultsTo(db.fn.now());
  });
};

exports.down = async function(db) {
  await db.schema.dropTable(tableName);
};
`;

  console.log('Writting to', path);

  fs.writeFileSync(path, content);
}

function createSQLSeed(name) {
  const migrationsPath = normalize(__dirname + '/../src/db/seeds/');
  const timestamp = getTimestamp();
  const fileName = `${timestamp}_${name}.seed.js`;
  const path = migrationsPath + fileName;

  const content = `'use strict';

const tableName = '';

const values = [
  {
    field: 'value'
  }
];

exports.up = async function(db) {
  await db.transaction(async function(t) {
    await db.batchInsert(tableName, values).transacting(t);
  });
};

exports.down = async function(db) {
  const promises = [];

  values.map(function(value) {
    const promise = db(tableName).where('field', value.field).del();
    promises.push(promise);
  });

  await Promise.all(promises);
};
`;

  console.log('Writting to', path);

  fs.writeFileSync(path, content);
}

const argv = process.argv;
if (argv.length < 3) {
  console.error('Needs two parameters: File type and name');
  process.exit(1);
}

const type = argv[2];
const name = argv[3];

const typeHandler = {
  'migration': createSQLMigration,
  'seed': createSQLSeed
};

const handler = typeHandler[type];
if (!handler) {
  const options = Object.keys(typeHandler).join(',');
  console.error(`Unrecognized file type "${type}". Available options: ${options}`);
  process.exit(1);
}

handler(name);
