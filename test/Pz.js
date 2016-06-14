'use strict';

var Pz = require('../src/Pz');
var Suites = require('./suites/');

describe("Pz.Pz", function() {
  const suites = new Suites(Pz);

  describe("infra", suites.infra);

  describe("is PassThrough", suites.isPassThrough);

  describe("#merge()", suites.isMerge);

  describe("#split()", suites.isSplit);

  describe("is Box", suites.isBox);
});
