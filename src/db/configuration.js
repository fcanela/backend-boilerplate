'use strict';

module.exports = function getConfiguration() {
  return {
    client: 'pg',
    connection: {
      host: process.env.POSTGRESQL_HOST,
      user: process.env.POSTGRESQL_USER,
      password: process.env.POSTGRESQL_PASSWORD,
      database: process.env.POSTGRESQL_NAME
    }
  };
};
