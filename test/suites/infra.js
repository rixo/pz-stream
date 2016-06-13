'use strict';

const expect = require('unexpected');
const Stream = require('readable-stream');
const Counter = require('./util/Counter');

module.exports = infra;

function infra(TestedStream) {

  it("is a factory", function() {
    var stream = TestedStream();
    expect(stream, 'to be a', TestedStream);
  });

  it("is a constructor", function() {
    var stream = new TestedStream();
    expect(stream, 'to be a', TestedStream);
  });

  it("factory default objectMode is true", function() {
    var stream = TestedStream();
    expect(stream._writableState.objectMode, 'to be true');
    expect(stream._readableState.objectMode, 'to be true');
  });

  it("constructor default objectMode is true", function() {
    var stream = new TestedStream();
    expect(stream._writableState.objectMode, 'to be true');
    expect(stream._readableState.objectMode, 'to be true');
  });

  describe("#obj()", function() {
    it("is a factory", function() {
      var stream = TestedStream.obj.call(null);
      expect(stream, 'to be a', TestedStream);
    });
    it("is a constructor", function() {
      var stream = new TestedStream.obj();
      expect(stream, 'to be a', TestedStream);
    });
    describe("set objectMode option", function() {
      context("as a factory", function() {
        it("with no options", function() {
          var stream = TestedStream.obj();
          expect(stream._writableState.objectMode, 'to be true');
          expect(stream._readableState.objectMode, 'to be true');
        });
        it("with options", function() {
          var stream = TestedStream.obj({other: 'foo'});
          expect(stream._writableState.objectMode, 'to be true');
          expect(stream._readableState.objectMode, 'to be true');
        });
        it("with conflicting options", function() {
          var stream = TestedStream.obj({objectMode: false});
          expect(stream._writableState.objectMode, 'to be false');
          expect(stream._readableState.objectMode, 'to be false');
        });
      });
      context("as a constructor", function() {
        it("with no options", function() {
          var stream = new TestedStream.obj();
          expect(stream._writableState.objectMode, 'to be true');
          expect(stream._readableState.objectMode, 'to be true');
        });
        it("with options", function() {
          var stream = new TestedStream.obj({other: 'foo'});
          expect(stream._writableState.objectMode, 'to be true');
          expect(stream._readableState.objectMode, 'to be true');
        });
        it("with conflicting options", function() {
          var stream = new TestedStream.obj({objectMode: false});
          expect(stream._writableState.objectMode, 'to be false');
          expect(stream._readableState.objectMode, 'to be false');
        });
      });
    });
  });

  describe("#raw()", function() {
    it("is a factory", function() {
      var stream = TestedStream.raw.call(null);
      expect(stream, 'to be a', TestedStream);
    });
    it("is a constructor", function() {
      var stream = new TestedStream.raw();
      expect(stream, 'to be a', TestedStream);
    });
    describe("set objectMode option", function() {
      context("as a factory", function() {
        it("with no options", function() {
          var stream = TestedStream.raw();
          expect(stream._writableState.objectMode, 'to be false');
          expect(stream._readableState.objectMode, 'to be false');
        });
        it("with options", function() {
          var stream = TestedStream.raw({other: 'foo'});
          expect(stream._writableState.objectMode, 'to be false');
          expect(stream._readableState.objectMode, 'to be false');
        });
        it("with conflicting options", function() {
          var stream = TestedStream.raw({objectMode: true});
          expect(stream._writableState.objectMode, 'to be true');
          expect(stream._readableState.objectMode, 'to be true');
        });
      });
      context("as a constructor", function() {
        it("with no options", function() {
          var stream = new TestedStream.raw();
          expect(stream._writableState.objectMode, 'to be false');
          expect(stream._readableState.objectMode, 'to be false');
        });
        it("with options", function() {
          var stream = new TestedStream.raw({other: 'foo'});
          expect(stream._writableState.objectMode, 'to be false');
          expect(stream._readableState.objectMode, 'to be false');
        });
        it("with conflicting options", function() {
          var stream = new TestedStream.raw({objectMode: true});
          expect(stream._writableState.objectMode, 'to be true');
          expect(stream._readableState.objectMode, 'to be true');
        });
      });
    });
  });
}
