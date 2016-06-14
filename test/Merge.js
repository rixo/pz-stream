'use strict';

var Merge = require('../src/Merge');

var Suites = require('./suites/');

describe("Pz.Merge", function() {

  var suites = new Suites(Merge);

  describe("infra", suites.infra);

  describe("is PassThrough", suites.isPassThrough);

  describe("#merge()", suites.isMerge);
});
