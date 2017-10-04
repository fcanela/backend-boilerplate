'use strict';

const fs = require('fs');
const normalize = require('path').normalize;
const handlebars = require('handlebars');

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

    const template = fs.readFileSync(__dirname + '/create_templates/migration.js').toString();
    const content = handlebars.compile(template)({ name });

    console.log('Writting to', path);

    fs.writeFileSync(path, content);
  }

  function createSQLSeed(name) {
    const migrationsPath = normalize(__dirname + '/../src/db/seeds/');
    const timestamp = getTimestamp();
    const fileName = `${timestamp}_${name}.seed.js`;
    const path = migrationsPath + fileName;

    const template = fs.readFileSync(__dirname + '/create_templates/seed.js').toString();
    const content = handlebars.compile(template)({ name });

    console.log('Writting to', path);

    fs.writeFileSync(path, content);
  }

  function createTestSQLSeed(name) {
    const migrationsPath = normalize(__dirname + '/../test/functional/seeds/');
    const timestamp = getTimestamp();
    const fileName = `${timestamp}_${name}.seed.js`;
    const path = migrationsPath + fileName;

    const template = fs.readFileSync(__dirname + '/create_templates/test_seed.js').toString();
    const content = handlebars.compile(template)({ name });

    console.log('Writting to', path);

    fs.writeFileSync(path, content);
  }

  function createFake(name) {
    const basePath = normalize(__dirname + '/../test/functional/fake/');
    const fileName = `${name}.fake.js`;
    const path = basePath + fileName;

    const template = fs.readFileSync(__dirname + '/create_templates/fake.js').toString();
    const content = handlebars.compile(template)({ name });

    console.log('Writting to', path);

    fs.writeFileSync(path, content);
  }

  function createTest(name) {
    const basePath = normalize(__dirname + '/../test/functional/');
    const fileName = `${name}.spec.js`;
    const path = basePath + fileName;

    const template = fs.readFileSync(__dirname + '/create_templates/test.js').toString();
    const content = handlebars.compile(template)({ name });

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
    'seed': createSQLSeed,
    'test-seed': createTestSQLSeed,
    'fake': createFake
};

const handler = typeHandler[type];
if (!handler) {
  const options = Object.keys(typeHandler).join(',');
  console.error(`Unrecognized file type "${type}". Available options: ${options}`);
  process.exit(1);
}

handler(name);
