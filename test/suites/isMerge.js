'use strict';

const expect = require('unexpected');
const Stream = require('readable-stream');
const Counter = require('./util/Counter');

module.exports = isMetge;

function isMetge(TestedStream) {
  var counter;
  var inputs;
  var stream;
  var lateInput;

  beforeEach(function() {
    counter = Counter();

    stream = TestedStream.obj();

    inputs = [];

    ['a', 'b', 'c'].forEach(alpha => {
      var input = new Stream.PassThrough({objectMode: true});
      [1, 2, 3].map(function(num) {
        var o = {id: alpha + num, num: num, alpha: alpha};
        input.push(o);
      });
      input.push(null);
      inputs.push(input);
      input.pipe(stream);
    });

    var _lateInput = new Stream.PassThrough({objectMode: true});
    lateInput = _lateInput;
    setTimeout(() => {
      _lateInput.push({});
      _lateInput.push(null);
    });
  });

  it("merges all inputs and finishes", function(done) {
    lateInput
      .pipe(stream)
      .pipe(counter)
      .on('finish', function() {
        expect(counter.count, 'to be', 10);
        done();
      })
  });

  it("merges all inputs and ends", function(done) {
    lateInput
      .pipe(stream)
      .pipe(counter)
      .on('end', function() {
        expect(counter.count, 'to be', 10);
        done();
      })
      .resume();
  });

  it("doesn't wait on unpiped sources", function(done) {
    var input = new Stream.PassThrough({objectMode: true});
    input.pipe(stream);
    lateInput
      .pipe(stream)
      .pipe(counter)
      .on('finish', function() {
        expect(counter.count, 'to be', 10);
        done();
      });
    input.unpipe(stream);
  });

  ['finish', 'end'].forEach(event => {
    describe(event + " event", function() {
      it("is triggered when flowing", function(done) {
        var stream = TestedStream.obj();
        var test = new Stream.PassThrough({objectMode: true});
        test
          .pipe(stream)
          .on(event, () => done())
          .resume();
        test.end();
      });

      it("is not triggered when not flowing", function(done) {
        var stream = TestedStream.obj();
        var test = new Stream.PassThrough({objectMode: true});
        var tooEarly = () => done('finished too early!');
        test
          .pipe(stream)
          .on(event, tooEarly);
        test.unpipe(stream);
        test.end();
        setTimeout(done);
      });

      it("is triggered when becoming flowing while not being waiting", function(done) {
        var stream = TestedStream.obj();
        var test = new Stream.PassThrough({objectMode: true});
        var tooEarly = () => done('finished too early!');
        test
          .pipe(stream)
          .on(event, tooEarly);
        test.unpipe(stream);
        test.end();
        stream.removeListener(event, tooEarly);
        stream
          .on(event, done)
          .resume();
      });
    });
  });
}
