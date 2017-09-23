'use strict';

const expect = require('chai').expect;

const getConfiguration = require('./configuration');

describe('Database configuration', () => {
  it('should export an object', () => {
    expect(getConfiguration()).to.be.an('object');
  });

  it('should use PostgreSQL as database connector', () => {
    expect(getConfiguration().client).to.equal('pg');
  });

  it('should read configuration from environment variables', () => {
    const env = process.env;
    env.POSTGRESQL_HOST = 'foobar.com';
    env.POSTGRESQL_USER = 'admin';
    env.POSTGRESQL_PASSWORD = '12345';
    env.POSTGRESQL_NAME = 'dbname';

    const connection = getConfiguration().connection;

    expect(connection).to.exist;
    expect(connection.host).to.exist;
    expect(connection.host).to.equal(env.POSTGRESQL_HOST);
    expect(connection.user).to.exist;
    expect(connection.user).to.equal(env.POSTGRESQL_USER);
    expect(connection.password).to.exist;
    expect(connection.password).to.equal(env.POSTGRESQL_PASSWORD);
    expect(connection.database).to.exist;
    expect(connection.database).to.equal(env.POSTGRESQL_NAME);
  });

});
