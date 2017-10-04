'use strict';

const expect = require('chai').expect;


// TODO: Change title
describe('METOD /resource', () => {
  let Client, storage;
  before(async () => {
    const utils = await require('./utils').getTestsUtils();
    Client = utils.Client;
    storage = utils.storage;
  });

  // TODO: Add expected behaviour title
  it('should ', async () => {
    // TODO: Check test seed path
    const fixture = storage.get('/{{name}}/testname/fixture');
    const client = new Client();

    // TODO: Change method and resource
    const res = await client.post('/resource', fixture);

    const body = res.body;
    // TODO: Add assertions
    expect(body).not.to.have.property('error');
    expect(body).to.have.property('id');
  });
});
