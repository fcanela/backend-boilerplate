'use strict';

const randomize = require('randomatic');

module.exports = {
  name: 'user',
  generate: function generator(properties=[], values={}) {
    let result = {
      name: randomize('A', 1) + randomize('a',6),
      password: randomize('*', 20),
      email: randomize('a', 8) + '@' + randomize('a', 12) + '.com',
    };

    if (properties.includes('surname')) result.surname = randomize('A', 1) + randomize('a',6) + ' ' + randomize('A', 1) + randomize('a',5);
    if (properties.includes('phone')) result.phone = 600000000 + randomize('0', 8);

    result = Object.assign(result, values);

    return result;
  }
}
