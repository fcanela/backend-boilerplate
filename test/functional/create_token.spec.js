'use strict';

const expect = require('chai').expect;


describe('POST /tokens', () => {
  let Client, storage;
  before(async () => {
    const utils = await require('./utils').getTestsUtils();
    Client = utils.Client;
    storage = utils.storage;
  });

  it('should create a token when credentials are valid', async () => {
    const fixture = storage.get('/create_token/validCase/credential');
    const client = new Client();

    const res = await client.post('/tokens', fixture);

    const body = res.body;
    expect(body).not.to.have.property('error');
    expect(body).to.have.property('token');
  });
});
