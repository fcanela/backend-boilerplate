'use strict';

const expect = require('chai').expect;


describe('md5 hash module', () => {
  const password = '12345';
  const hashedPassword = '827ccb0eea8a706c4c34a16891f84e7b';

  const hashModule = require('./md5');

  describe('hash method', () => {
    it('should exists', () => {
      expect(hashModule).to.have.a.property('hash');
      expect(hashModule.hash).to.be.a('function');
    });

    it('should provide the correct hash', async () => {
      const hash = await hashModule.hash(password);
      expect(hash).to.equal(hashedPassword);
    });

  });

  describe('verify method', () => {
    it('should exists', () => {
      expect(hashModule).to.have.a.property('verify');
      expect(hashModule.verify).to.be.a('function');
    });

    it('should fail when the password is incorrect', async () => {
      const wrongPassword = '54321';
      const result = await hashModule.verify(wrongPassword, hashedPassword);
      expect(result).to.be.false;
    });

    it('should succeed when a correct password is provided', async () => {
      const result = await hashModule.verify(password, hashedPassword);
      expect(result).to.be.true;
    });
  });
});
