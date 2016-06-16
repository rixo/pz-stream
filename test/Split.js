'use strict';

var Split = require('../src/Split');
var Suites = require('./suites/');

describe("Pz.Split", function() {
  this.timeout(100);

  var suites = new Suites(Split);

  describe("infra", suites.infra);

  describe("is PassThrough", suites.isPassThrough);

  describe("#split()", suites.isSplit);
});
