'use strict';

const expect = require('chai').expect;

const hashes = require('.');

describe('Hashes', () => {
  it('should include bcrypt', () => {
    expect(hashes).to.have.property('bcrypt');
  });
});
