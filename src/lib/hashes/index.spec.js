'use strict';

const expect = require('chai').expect;

const hashes = require('.');

describe('Hashes', () => {
  it('should include legacy md5', () => {
    expect(hashes).to.have.property('md5');
  });

  it('should include bcrypt', () => {
    expect(hashes).to.have.property('bcrypt');
  });
});
