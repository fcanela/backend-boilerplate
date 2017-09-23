'use strict';

module.exports = function generator(min=0, max=10000, precision=2) {
  let number = Math.random() * (max - min) + min;
  number = parseFloat(number.toFixed(precision));
  return number;
};
