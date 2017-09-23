'use strict';

const randomize = require('randomatic');
const randomNumber = require('./number');

module.exports = function generator(properties=[], values={}) {
  let result = {
    userId: randomize('0', 10),
    operation: 'rental',
    type: 'flat',
    postalCode: randomize('?', 1, { chars: '01234' }) + randomize('0', 4), // Limiting to a subset of valid postal codes
    provinceId: randomize('0', 2),
    municipalityId: randomize('0', 15),
    townId: randomize('0', 60),
    street: 'Calle ' + randomize('A', 1) + randomize('a',6) + ' ' + randomize('A', 1) + randomize('a',15),
    isListed: false
  };

  if (properties.includes('number')) result.number = parseInt(randomize('0', 2));
  if (properties.includes('price')) result.price = randomNumber(1, 1000000);
  if (properties.includes('latitude')) result.latitude = randomNumber(-90, 90, 7);
  if (properties.includes('longitude')) result.longitude = randomNumber(-180, 180, 7);

  result = Object.assign(result, values);

  return result;
};
