'use strict';

var expect = require('unexpected');
var Stream = require('readable-stream');
var Counter = require('./util/Counter');

module.exports = isPassThrough;

function isPassThrough(TestedStream) {
  describe("initially acts as a pass-through", function() {
    var inputs;
    var counter;
    var input;
    var stream;

    beforeEach(function() {
      counter = Counter();
      input = new Stream.PassThrough({objectMode: true});

      inputs = [1, 2, 3].map(function(id) {
        var o = {id: id};
        input.push(o);
        return o;
      });

      input.push(null);

      stream = input
        .pipe(new TestedStream({objectMode: true}))
        .pipe(counter);
    });

    it("propagates 'finish'", function(done) {
      stream
        .on('error', err => done(err))
        .on('finish', function() {
          expect(counter.count, 'to be', 3);
          expect(counter.chunks, 'to contain', inputs[0]);
          expect(counter.chunks, 'to contain', inputs[1]);
          expect(counter.chunks, 'to contain', inputs[2]);
          done();
        });
    });

    it("propagates 'end'", function(done) {
      stream
        .on('error', err => done(err))
        .on('end', function() {
          expect(counter.count, 'to be', 3);
          expect(counter.chunks, 'to contain', inputs[0]);
          expect(counter.chunks, 'to contain', inputs[1]);
          expect(counter.chunks, 'to contain', inputs[2]);
          done();
        })
        .resume();
    });

    it("propagates both 'finish' and 'end'", function() {
      return Promise.all([
        new Promise((resolve, reject) => {
          stream
            .on('error', reject)
            .on('finish', function() {
              expect(counter.count, 'to be', 3);
              expect(counter.chunks, 'to contain', inputs[0]);
              expect(counter.chunks, 'to contain', inputs[1]);
              expect(counter.chunks, 'to contain', inputs[2]);
              resolve();
            });
        }),
        new Promise((resolve, reject) => {
          stream
            .on('error', reject)
            .on('end', function() {
              expect(counter.count, 'to be', 3);
              expect(counter.chunks, 'to contain', inputs[0]);
              expect(counter.chunks, 'to contain', inputs[1]);
              expect(counter.chunks, 'to contain', inputs[2]);
              resolve();
            })
            .resume();
        })
      ])
    });

    it("reads what is written to it", done => {
      const o = {id: 4};
      const stream = new TestedStream({objectMode: true});
      const counter = Counter();
      stream.write(o, err => {
        if (err) {
          done(err);
        } else {
          stream
            .pipe(counter)
            .on('error', err => done(err))
            .on('end', () => {
              expect(counter.count, 'to be', 1);
              expect(counter.chunks, 'to contain', o);
              done();
            })
            .resume();
          stream.end();
        }
      });
    });
  });
}
