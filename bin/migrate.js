'use strict';

const normalize = require('path').normalize;
const getConfiguration = require('../src/db/configuration');

function connectKnex(uri) {
  const configuration = getConfiguration();
  if (uri) {
    configuration.connection = uri;
  }

  return require('knex')(configuration);
}

const argv = process.argv;
if (argv.length < 2) {
  console.error('Needs one parameters: What to migrate');
  process.exit(1);
}

const type = argv[2];
const uri = argv[3];

const typeHandler = {
  'schemas:latest': migrateSchemas,
  'seeds:latest': migrateSeeds,
  'test_seeds:latest': migrateTestSeeds
};

const handler = typeHandler[type];
if (!handler) {
  const options = Object.keys(typeHandler).join(',');
  console.error(`Unrecognized migration type "${type}". Available options: ${options}`);
  process.exit(1);
}

let knex = connectKnex(uri);
try {
  knex = connectKnex(uri);
} catch (err) {
  console.log('Error connecting to database');
  console.error(err);
  process.kill(process.pid);
}

handler()
  .then(function() {
    process.exit(0);
  })
  .catch(function(error) {
    console.log(error);
    process.exit(1);
  });

async function migrate(relativePath, tableName) {
  const directory = normalize(__dirname + relativePath);

  console.log('Checking and running pending migrations from', directory);

  const config = {
    tableName,
    directory
  };
  const result = await knex.migrate.latest(config);

  await knex.destroy();

  const executedMigrations = result[1];
  return executedMigrations;
}

function printMigrationResult(executedMigrations) {
  const number = executedMigrations.length;

  if (number === 0) return console.log('No pending migrations found');

  console.log('Executed', number, 'migrations');
  console.log('------------------------------------------------');
  executedMigrations.forEach(function(migration) {
    console.log(migration);
  });
  console.log('------------------------------------------------');
}

async function migrateSchemas() {
  console.log('Migrating schemas');

  const result = await migrate('/../src/db/migrations/', 'meta_estates_migrations');
  printMigrationResult(result);
}

async function migrateSeeds() {
  console.log('Migrating seeds');

  const result = await migrate('/../src/db/seeds/', 'meta_estates_seeds');
  printMigrationResult(result);
}

async function migrateTestSeeds() {
  console.log('Migrating test seeds');

  const result = await migrate('/../test/functional/seeds/', 'meta_estates_test_seeds');
  printMigrationResult(result);
}

