'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const modelDefinition = require('./estate.model').define;

describe('Estate model', () => {
  let db;
  let dbMock;
  let model;
  beforeEach(() => {
    dbMock = {
      insert: sinon.spy(function() {
        return this;
      }),
      where: sinon.spy(function() {
        return this;
      }),
      select: sinon.spy(function() {
        return this;
      }),
      returning: sinon.spy(function() {
        return Promise.resolve([{
          id: 3
        }]);
      }),
    };
    db = sinon.spy(() => {
      return dbMock;
    });
    db.raw = sinon.spy(function() {
      return this;
    });
    model = modelDefinition(db);
  });

  describe('create method', async () => {
    const validEstate = {
      userId: '87654',
      type: 'flat',
      operation: 'rental',
      isListed: false,
      street: 'Calle Bolsena',
      number: 97,
      postalCode: '41089',
      price: 900.50
    };

    let newEstateData;
    beforeEach(() => {
      newEstateData = Object.assign({}, validEstate);
      dbMock.returning = sinon.spy(function() {
        const result = Object.assign({}, newEstateData);
        result.id = '3';
        return Promise.resolve([result]);
      });
    });

    it('should save the estate info in the "estate" table', async () => {
      await model.create(newEstateData);
      expect(dbMock.insert.called).to.be.true;
      const insertedData = dbMock.insert.getCall(0).args[0];
      expect(insertedData).to.have.property('userId');
      expect(insertedData).to.have.property('isListed');
      expect(insertedData).to.have.property('type');
      expect(insertedData).to.have.property('operation');
      expect(insertedData).to.have.property('street');
      expect(insertedData).to.have.property('number');
      expect(insertedData).to.have.property('postalCode');
      expect(insertedData).to.have.property('price');
    });

    it('should add the point', async () => {
      newEstateData.longitude = 3.13159;
      newEstateData.latitude = 7.777;
      await model.create(newEstateData);
      expect(dbMock.insert.called).to.be.true;
      const insertedData = dbMock.insert.getCall(0).args[0];
      expect(insertedData).to.have.property('userId');
      expect(insertedData).to.have.property('isListed');
      expect(insertedData).to.have.property('type');
      expect(insertedData).to.have.property('operation');
      expect(insertedData).to.have.property('street');
      expect(insertedData).to.have.property('number');
      expect(insertedData).to.have.property('postalCode');
      expect(insertedData).to.have.property('latitude');
      expect(insertedData).to.have.property('longitude');
      expect(insertedData).to.have.property('location');
      expect(insertedData).to.have.property('price');
    });
  });
});
