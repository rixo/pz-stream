'use strict';

const expect = require('unexpected');
const Stream = require('readable-stream');
const Counter = require('./util/Counter');

module.exports = isBox;

function isBox(TestedStream) {
  it("works", function() {
    var counter = Counter();
    var input = new Stream.PassThrough({objectMode: true});
    input.push('');
    input.push('_');
    input.push(null);

    var box = TestedStream.obj();

    box
      .append(function() {
        return new Stream.Transform({
          objectMode: true,
          transform: function(chunk, enc, done) {
            this.push(chunk + 'c');
            done();
          }
        });
      })
      .prepend(function() {
        return new Stream.Transform({
          objectMode: true,
          transform: function(chunk, enc, done) {
            this.push(chunk + 'b');
            done();
          }
        });
      })
      .append(new Stream.Transform({
        objectMode: true,
        transform: function(chunk, enc, done) {
          this.push(chunk + 'd');
          done();
        }
      }))
      .prepend(new Stream.Transform({
        objectMode: true,
        transform: function(chunk, enc, done) {
          this.push(chunk + 'a');
          done();
        }
      }))
      .append(new Stream.Transform({
        objectMode: true,
        transform: function(chunk, enc, done) {
          this.push(chunk + 'e');
          done();
        }
      }))
      .prepend(new Stream.Transform({
        objectMode: true,
        transform: function(chunk, enc, done) {
          this.push(chunk + '*');
          done();
        }
      }))
    ;

    var stream = input
      .pipe(box)
      .pipe(counter)
      .resume();

    return Promise.all([
      new Promise(resolve => {
        stream.on('finish', function() {
          expect(counter.count, 'to be', 2);
          expect(counter.chunks, 'to contain', '*abcde');
          expect(counter.chunks, 'to contain', '_*abcde');
          resolve();
        });
      }),
      new Promise(resolve => {
        stream.on('end', resolve);
      })
    ])
  });
}
