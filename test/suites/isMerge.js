'use strict';

const expect = require('unexpected');
const Stream = require('readable-stream');
const Counter = require('./util/Counter');

module.exports = isMerge;

function isMerge(TestedStream) {
  var counter;
  var inputs;
  var stream;
  var lateInput;

  describe("#pipe()", function() {
    testInterface((stream, input) => {
      return input.pipe(stream);
    });
  });

  describe("#merge()", function() {
    testInterface((stream, input) => {
      stream.merge(input);
      return stream;
    });

    describe("accepts multiple sources", function() {
      var counter;
      var stream;
      var inputs;

      function createInput() {
        const input = new Stream.PassThrough({objectMode: true});
        [1,2,3].forEach(num => input.write(num));
        input.end();
        return input;
      }
      beforeEach(function() {
        counter = Counter();
        stream = TestedStream.obj();
        inputs = [
          createInput(),
          createInput(),
          createInput()
        ];
      });
      it("as separate arguments", function(done) {
        stream
          .merge(inputs[0], inputs[1])
          .pipe(counter)
          .on('end', () => {
            expect(counter.count, 'to be', 6);
            done();
          })
          .resume();
      });
      it("as an array", function(done) {
        stream
          .merge(inputs)
          .pipe(counter)
          .on('end', () => {
            expect(counter.count, 'to be', 9);
            done();
          })
          .resume();
      });
      it("as arguments and array", function(done) {
        const extra = createInput();
        stream
          .merge(extra, inputs)
          .pipe(counter)
          .on('end', () => {
            expect(counter.count, 'to be', 12);
            done();
          })
          .resume();
      });
    });
  });

  function testInterface(assemble) {
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
        assemble(stream, input);
      });

      var _lateInput = new Stream.PassThrough({objectMode: true});
      lateInput = _lateInput;
      setTimeout(() => {
        _lateInput.push({});
        _lateInput.push(null);
      });
    });

    it("merges all inputs and finishes", function(done) {
      assemble(stream, lateInput)
        .pipe(counter)
        .on('finish', function() {
          expect(counter.count, 'to be', 10);
          done();
        })
    });

    it("merges all inputs and ends", function(done) {
      assemble(stream, lateInput)
        .pipe(counter)
        .on('end', function() {
          expect(counter.count, 'to be', 10);
          done();
        })
        .resume();
    });

    it("doesn't wait on unpiped sources", function(done) {
      var input = new Stream.PassThrough({objectMode: true});
      assemble(stream, input);
      assemble(stream, lateInput)
        .pipe(counter)
        .on('finish', function() {
          expect(counter.count, 'to be', 10);
          done();
        });
      input.unpipe(stream);
    });
  }

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
        const stream = TestedStream.obj();
        const test = new Stream.PassThrough({objectMode: true});
        const tooEarly = () => done('finished too early!');
        test
          .pipe(stream)
          .on(event, tooEarly);
        //test.unpipe(stream);
        test.end();
        stream.removeListener(event, tooEarly);
        stream
          .on(event, done)
          .resume();
      });
    });
  });
}
