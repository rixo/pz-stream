'use strict';

const Suites = require('./suites/');
const Box = require('../src/Box');

describe("Pz.Box", function() {

  const suites = new Suites(Box);

  describe("infra", suites.infra);

  describe("is PassThrough", suites.isPassThrough);

  describe("is Box", suites.isBox);
});
