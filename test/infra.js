/**
 * Ensures test consistency.
 */
const PassThrough = require('readable-stream').PassThrough;
const Suites = require('./suites/');

// PassThrough must pass PassTrough test suite (or the test is broken)
describe("Suites.isPassThrough", function() {
  const suites = new Suites(PassThrough);
  suites.isPassThrough();
});
