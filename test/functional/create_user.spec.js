'use strict';

const expect = require('chai').expect;


describe('POST /users', () => {
  let Client, storage;
  before(async () => {
    const utils = await require('./utils').getTestsUtils();
    Client = utils.Client;
    storage = utils.storage;
  });

  it('should create a user given a password and the required fields', async () => {
    const fixture = storage.get('/createUser/user1/fixture');
    const client = new Client();

    const res = await client.post('/users', fixture);

    const body = res.body;
    expect(body).not.to.have.property('error');
    expect(body).to.have.property('id');
    expect(body).to.have.property('email');
    expect(body).to.have.property('name');
    expect(body).to.have.property('surname');
    expect(body).to.have.property('phone');
  });
});
