'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();


describe('Bcrypt hash module', () => {
  const password = '1234';
  const hashedPassword = '$$$$$';

  let hashModule;
  let bcrypt;
  beforeEach(() => {
    bcrypt = {
      hash: sinon.stub().resolves(hashedPassword),
      compare: sinon.stub().resolves(true)
    };
    hashModule = proxyquire('./bcrypt', {
      bcrypt
    });
  });
  describe('hash method', () => {
    it('should exists', () => {
      expect(hashModule).to.have.a.property('hash');
      expect(hashModule.hash).to.be.a('function');
    });

    it('should hash with bcrypt library with 10 rounds if none provided', async () => {
      const hash = await hashModule.hash(password);

      expect(hash).to.equal(hashedPassword);
      expect(bcrypt.hash.calledOnce).to.be.true;
      const args = bcrypt.hash.getCall(0).args;
      expect(args[0]).to.equal(password);
      expect(args[1]).to.equal(10);
    });

    it('should hash with bcrypt library using configurable number of rounds', async () => {
      const rounds = 20;
      process.env.BCRYPT_ROUNDS = rounds;

      const hash = await hashModule.hash(password);
      expect(hash).to.equal(hashedPassword);
      expect(bcrypt.hash.calledOnce).to.be.true;
      const args = bcrypt.hash.getCall(0).args;
      expect(args[0]).to.equal(password);
      expect(args[1]).to.equal(rounds);
      process.env.BCRYPT_ROUNDS = undefined;
    });

    it('should work with the real interface', async function() {
      const bcrypt = require('bcrypt')
      const hashModule = require('./bcrypt');

      const hash = await hashModule.hash(password);
      const result = await require('bcrypt').compare(password, hash);
      expect(result).to.be.true;
    });
  });

  describe('verify method', () => {
    it('should exists', () => {
      expect(hashModule).to.have.a.property('verify');
      expect(hashModule.verify).to.be.a('function');
    });

    it('should call bcrypt library to verify the password', async () => {
      const result = await hashModule.verify(password, hashedPassword);

      expect(result).to.be.true;
      expect(bcrypt.compare.calledOnce).to.be.true;
      const args = bcrypt.compare.getCall(0).args;
      expect(args[0]).to.equal(password);
      expect(args[1]).to.equal(hashedPassword);
    });

    it('should return false when the verification fails', async () => {
      bcrypt.compare = sinon.stub().resolves(false);
      const result = await hashModule.verify(password, hashedPassword);

      expect(result).to.be.false;
      expect(bcrypt.compare.calledOnce).to.be.true;
      const args = bcrypt.compare.getCall(0).args;
      expect(args[0]).to.equal(password);
      expect(args[1]).to.equal(hashedPassword);
    });

    it('should verify valid passwords with the real interface', async () => {
      const bcrypt = require('bcrypt')
      const hashModule = require('./bcrypt');

      const originalString = 'test';
      const hash = '$2a$06$VvbGuREfpOjKP.2mhhhRw.uNEEV96KUbe//WiAGsUx2x/ud8HFjMy';

      const result = await hashModule.verify(originalString, hash);
      expect(result).to.be.true;
    });

    it('should verify invalid passwords with the real interface', async () => {
      const bcrypt = require('bcrypt')
      const hashModule = require('./bcrypt');

      const originalString = 'invalid';
      const hash = '$2a$06$VvbGuREfpOjKP.2mhhhRw.uNEEV96KUbe//WiAGsUx2x/ud8HFjMy';

      const result = await hashModule.verify(originalString, hash);
      expect(result).to.be.false;
    });
  });
});
