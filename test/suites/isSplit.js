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
    it("creates a new stream with given filter", function(done) {
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
    it("split stream ends as expected when piped before trunk", function(done) {
      stream.big
        .on('end', () => {
          console.trace()
          //expect(counter.count, 'to be', 2);
          //done();
        })
        .pipe(counter)
        .on('end', () => {
          //console.trace()
          expect(counter.count, 'to be', 2);
          done();
        });
        //.resume();
      input
        .pipe(stream)
        .on('end', () => {
          console.trace()
          counter
            //.on('end', () => {
            //  expect(counter.count, 'to be', 2);
            //  done();
            //})
            .resume();
        })
        .resume();
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

    it("creates a new stream with given pattern", function(done) {
      //stream.foo.pipe(counter);
      input
        .pipe(stream)
        .on('end', function() {
          stream.foo
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
  });
}
