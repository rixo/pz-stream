'use strict';

var Stream = require('readable-stream');

module.exports = Counter;

var lastIndex = 0;

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
  stream.count = 0;
  stream.chunks = chunks;
  stream.$name = 'Counter#' + lastIndex++;
  return stream;
}
