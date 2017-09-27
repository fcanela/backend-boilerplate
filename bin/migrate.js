'use strict';

const normalize = require('path').normalize;
const logger = require('chorizo').for('migrations');
const getConfiguration = require('../src/db/configuration');

const serviceName = process.env.SERVICE_NAME || 'unknown_service_name';

function connectKnex(uri) {
  const configuration = getConfiguration();
  if (uri) {
    configuration.connection = uri;
  }

  return require('knex')(configuration);
}

const argv = process.argv;
if (argv.length < 2) {
  logger.fatal('Needs one parameters: What to migrate');
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
  logger.fatal(`Unrecognized migration type "${type}". Available options: ${options}`);
  process.exit(1);
}

let knex = connectKnex(uri);
try {
  knex = connectKnex(uri);
} catch (err) {
  logger.fatal('Error connecting to database', err);
  process.exit(1);
}

handler()
  .then(function() {
    process.exit(0);
  })
  .catch(function(error) {
    logger.fatal(error);
    process.exit(1);
  });

async function migrate(relativePath, tableName) {
  const directory = normalize(__dirname + relativePath);

  logger.info('Checking and running pending migrations from ' + directory);

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

  if (number === 0) return logger.info('No pending migrations found');

  logger.info('Executed ' +  number + ' migrations');
  executedMigrations.forEach(function(migration) {
    logger.info('Migrated ' + migration);
  });
}

async function migrateSchemas() {
  logger.info('Migrating schemas');

  const result = await migrate('/../src/db/migrations/', `meta_${serviceName}_migrations`);
  printMigrationResult(result);
}

async function migrateSeeds() {
  logger.info('Migrating seeds');

  const result = await migrate('/../src/db/seeds/', `meta_${serviceName}_seeds`);
  printMigrationResult(result);
}

async function migrateTestSeeds() {
  logger.info('Migrating test seeds');

  const result = await migrate('/../test/functional/seeds/', `meta_${serviceName}_test_seeds`);
  printMigrationResult(result);
}

