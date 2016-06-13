'use strict';

const Stream = require('readable-stream');
const Duplex = Stream.Duplex;
const util = require('util');

util.inherits(Box, Duplex);

module.exports = Box;

Box.obj = require('./obj')(Box);

Box.prototype._write = _write;
Box.prototype._read = (size) => {};

Box.prototype.append = append;
Box.prototype.prepend = prepend;

function Box(options) {
  if (!(this instanceof Box)) {
    return new Box(options);
  }
  if (!options) {
    options = {};
  }

  Duplex.call(this, options);

  this._in = new Stream.Readable(options);
  this._in._read = (size) => this.read(size);
  this.end = function(chunk) {
    if (chunk) {
      this._in.push(chunk);
    }
    this._in.push(null);
    delete this.end;
  };

  this._out = new Stream.Writable(options);
  this._out._write = (chunk, enc, done) => {
    this.push(chunk);
    done();
  };
  this._out.on('finish', () => {
    this.push(null);
  });

  this._tip = this._in;
  this._top = this._out;
  this._in.pipe(this._out);
}

function _write(chunk, enc, done) {
  this._in.push(chunk);
  done();
}

function prepend(factory) {
  var stream = typeof factory === 'function' ? factory() : factory;
  if (stream) {
    this._in.unpipe(this._top);
    this._in.pipe(stream);
    stream.pipe(this._top);
    this._top = stream;
  }
  return this;
}

function append(factory) {
  var stream = typeof factory === 'function' ? factory() : factory;
  if (stream) {
    this._tip.unpipe(this._out);
    this._tip.pipe(stream);
    this._tip = stream;
    this._tip.pipe(this._out);
    if (this._top === this._out) {
      this._top = this._tip;
    }
  }
  return this;
}
