'use strict';

const randomize = require('randomatic');

module.exports = {
  name: '{{name}}',
  generate: function generator(properties=[], values={}) {
    let result = {
      changeme: randomize('Aa', 15)
    };

    if (properties.includes('otherprop')) result.otherprop = randomize('Aa', 22);

    result = Object.assign(result, values);

    return result;
  }
}
