'use strict';

module.exports = Suites;

var suites = {
  infra: require('./infra'),
  isPassThrough: require('./isPassThrough'),
  isMerge: require('./isMerge'),
  isBox: require('./isBox')
};

Suites.Counter = require('./util/Counter');

function Suites(bind) {
  if (!(this instanceof Suites)) {
    return new Suites(bind);
  }
  Object.keys(suites).forEach((name) => {
    this[name] = () => {
      suites[name].apply(bind, arguments);
      return this;
    };
  });
}
