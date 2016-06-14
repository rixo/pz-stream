'use strict';

var Split = require('../src/Split');
var Suites = require('./suites/');

describe("Pz.Split", function() {

  var suites = new Suites(Split);

  describe("infra", suites.infra);

  describe("is PassThrough", suites.isPassThrough);

  describe("#split()", suites.isSplit);
});
