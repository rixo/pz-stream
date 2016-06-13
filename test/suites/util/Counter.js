'use strict';

var Stream = require('readable-stream');

module.exports = Counter;

function Counter() {
  var chunks = [];
  var stream = new Stream.Transform({
    objectMode: true,
    transform: function(chunk, enc, done) {
      chunks.push(chunk);
      stream.count = chunks.length;
      this.push(chunk);
      done();
    }
  });
  stream.chunks = chunks;
  return stream;
}
