'use strict';

var expect = require('unexpected');

var Pz = require('../src/Pz');
var Stream = require('readable-stream');

var Suites = require('./suites/');
var Counter = Suites.Counter;

describe("Pz.Pz", function() {
  const suites = new Suites(Pz);

  describe("infra", suites.infra);

  describe("is PassThrough", suites.isPassThrough);

  describe("#merge()", suites.isMerge);
});
