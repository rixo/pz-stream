'use strict';

const Suites = require('./suites/');
const Box = require('../src/Box');

describe("Pz.Box", function() {

  const suites = new Suites(Box);

  describe("infra", function() {
    suites.infra();
  });

  describe("is PassThrough", function() {
    suites.isPassThrough();
  });

  describe("is Box", function() {
    suites.isBox();
  });
});
