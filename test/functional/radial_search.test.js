'use strict';

const expect = require('chai').expect;

describe('Estate radial search listener', () => {
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

  describe('api.estates.radial_search', () => {
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

    it('should find only one estate when only one is within radio', async () => {
      const estate1 = storage.get('/radialSearch/simpleSearch1/center');
      const distance = storage.get('/radialSearch/simpleSearch1/distance');

      console.log('estate1', estate1);
      console.log('distance', distance);

      const event = {
        latitude: estate1.latitude,
        longitude: estate1.longitude,
        distance: distance/100
      };

      console.log('asking', event);
      const { metadata, payload } = await service.ask('api.estates.radial_search', event);
      console.log('metadata', metadata);
      console.log('payload', payload);
      expect(metadata).not.to.have.property('error');
      expect(payload).to.have.property('estates');
      expect(payload.estates).to.be.an('array');
      expect(payload.estates).to.have.lengthOf(1);
      checkProperties(payload.estates[0]);
    });

    it.skip('should find both estates when they are within radio', async () => {
      const estate1 = storage.get('/radialSearch/simpleSearch1/center');
      const estate2 = storage.get('/radialSearch/simpleSearch2/center');
      const distance = storage.get('/radialSearch/simpleSearch1/distance');

      const event = {
        latitude: estate1.latitude,
        longitude: estate1.longitude,
        distance
      };

      const { metadata, payload } = await service.ask('api.estates.radial_search', event);
      expect(metadata).not.to.have.property('error');
      expect(payload).to.have.property(estates);
      expect(payload.estates).to.be.an('array');
      expect(payload.estates.length).to.have.lengthOf(2);
      checkProperties(payload.estates[0]);
    });

  });
});
