'use strict';

const expect = require('unexpected');
const Stream = require('readable-stream');
const Counter = require('./util/Counter');

module.exports = isSplit;

function isSplit(TestedStream) {
  var counter;
  var input;
  var stream;

  describe("with filter", function() {
    beforeEach(function() {
      counter = Counter();
      input = new Stream.PassThrough({objectMode: true});

      [
        {id: 1},
        {id: 2},
        {id: 3}
      ].forEach(function(o) {
        input.push(o);
      });

      input.push(null);

      stream = TestedStream.obj().split('big', o => o.id > 1);
    });
    it("creates a new stream of same type", function() {
      expect(stream.big.constructor, 'to be', stream.constructor);
      expect(stream.big.constructor, 'to be', TestedStream);
    });
    it("applies filter to input", function(done) {
      expect(stream.big.constructor, 'to be', stream.constructor);
      input
        .pipe(stream)
        .on('end', () => {
          stream.big
            .pipe(counter)
            .on('end', () => {
              expect(counter.count, 'to be', 2);
              done();
            })
            .resume();
        })
        .resume();
    });
    it("outputs remaining files only", function(done) {
      input
        .pipe(stream)
        .pipe(counter)
        .on('end', function() {
          expect(counter.count, 'to be', 1);
          done();
        })
        .resume();
    });
    it("does not end if split stream is piped before trunk", function(done) {
      stream.big
        .pipe(counter)
        .on('end', () => {
          expect(counter.count, 'to be', 2);
          done();
        })
        .resume();
      input.pipe(stream).resume();
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

      stream = TestedStream.obj().split('foo', '*/foo.*');
    });
    it("creates a new stream of same type", () => {
      expect(stream.foo.constructor, 'to be', stream.constructor);
      expect(stream.foo.constructor, 'to be', TestedStream);
    });
    it("applies pattern to input", function(done) {
      stream.foo
        .pipe(counter)
        .on('end', () => {
          expect(counter.count, 'to be', 2);
          done();
        })
        .resume();
      input.pipe(stream).resume();
    });
    it("outputs remaining files only", done => {
      input
        .pipe(stream)
        .pipe(counter)
        .on('end', function() {
          expect(counter.count, 'to be', 1);
          done();
        })
        .resume();
    });
    it("does not end if split stream is piped before trunk", done => {
      stream.foo
        .pipe(counter)
        .on('end', () => {
          expect(counter.count, 'to be', 2);
          done();
        })
        .resume();
      input.pipe(stream).resume();
    });
  });
}
