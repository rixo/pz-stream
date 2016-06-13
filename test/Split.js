'use strict';

var expect = require('unexpected');

var Split = require('../src/Split');
var Stream = require('readable-stream');

var Suites = require('./suites/');
var Counter = Suites.Counter;

describe("Pz.Split", function() {

  describe("infra", function() {
    new Suites(Split).infra();
  });

  describe("is PassThrough", function() {
    new Suites(Split).isPassThrough();
  });

  describe("#split()", function() {
    var counter;
    var input;
    var stream;

    describe("with filter", function() {
      beforeEach(function() {
        counter = Counter();
        input = new Stream.PassThrough({objectMode: true});

        [1, 2, 3].map(function(id) {
          var o = {id: id};
          input.push(o);
        });

        input.push(null);

        stream = Split.obj().split('big', o => o.id > 1);
      });
      it("creates a new stream with given filter", function(done) {
        stream.big.pipe(counter);

        input
          .pipe(stream)
          .on('finish', function() {
            expect(counter.count, 'to be', 2);
            done();
          })
      });
      it("outputs remaining files only", function(done) {
        input
          .pipe(stream)
          .pipe(counter)
          .on('finish', function() {
            expect(counter.count, 'to be', 1);
            done();
          });
      });
    });

    describe("with pattern", function() {
      beforeEach(function() {
        counter = Counter();
        input = new Stream.PassThrough({objectMode: true});

        [
          {id: 1, cwd: '/somedir', path: '/somedir/scripts/foo.js'},
          {id: 2, cwd: '/somedir', path: '/somedir/styles/bar.css'},
          {id: 3, cwd: '/somedir', path: '/somedir/images/foo.png'}
        ].map(function(o) {
          input.push(o);
        });

        input.push(null);

        stream = Split.obj().split('foo', '*/foo.*');
      });

      it("creates a new stream with given pattern", function(done) {
        stream.foo.pipe(counter);
        input
          .pipe(stream)
          .on('finish', function() {
            expect(counter.count, 'to be', 2);
            done();
          })
      });

      it("outputs remaining files only", function(done) {
        input
          .pipe(stream)
          .pipe(counter)
          .on('finish', function() {
            expect(counter.count, 'to be', 1);
            done();
          });
      });
    });
  });
});
