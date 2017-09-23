'use strict';

const expect = require('chai').expect;

describe('Create estate listener', () => {
  let utils;
  let storage;
  before(async () => {
    utils = await require('./utils').getTestsUtils();
    storage = utils.storage;
  });

  let service;
  beforeEach(async () => {
    service = await utils.getService();
  });

  describe('api.estates.create_request', () => {
    function checkProperties(payload) {
      expect(payload).to.have.property('id');
      expect(payload).to.have.property('userId');
      expect(payload).to.have.property('type');
      expect(payload).to.have.property('operation');
      expect(payload).to.have.property('isListed');
      expect(payload).to.have.property('street');
      expect(payload).to.have.property('number');
      expect(payload).to.have.property('latitude');
      expect(payload).to.have.property('latitude');
      expect(payload).to.have.property('postalCode');
      expect(payload).to.have.property('price');
    }

    it('should create a estate given the minimun required fields', async () => {
      const fixture = storage.get('/create/basicEstate1/fixture');

      const { metadata, payload } = await service.ask('api.estates.create_request', fixture);
      expect(metadata).not.to.have.property('error');
      checkProperties(payload);
    });

    it('should create a estate given all the fields', async () => {
      const fixture = storage.get('/create/completeEstate1/fixture');

      const { metadata, payload } = await service.ask('api.estates.create_request', fixture);
      expect(metadata).not.to.have.property('error');
      checkProperties(payload);
    });
  });
});
