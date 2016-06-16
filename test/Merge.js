'use strict';

const Merge = require('../src/Merge');
const Suites = require('./suites/');

describe("Pz.Merge", function() {

  const suites = new Suites(Merge);

  describe("infra", suites.infra);

  describe("is PassThrough", suites.isPassThrough);

  describe("#merge()", suites.isMerge);
});
