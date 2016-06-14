'use strict';

const Stream = require('readable-stream');
const Transform = Stream.Transform;
const util = require('util');
const PzBase = require('./PzBase');

util.inherits(Box, Transform);

module.exports = Box;

Box.obj = require('./obj')(Box).obj;
Box.raw = require('./obj')(Box).raw;

Box.prototype._transform = _transform;

Box.prototype.append = append;
Box.prototype.prepend = prepend;

function Box(options) {
  if (!(this instanceof Box)) {
    return new Box(options);
  }
  PzBase.call(this, Box, options);
  Transform.call(this, this._options);

  this._in = new Stream.Readable(options);
  this._in._read = (size) => this.read(size);

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

function _transform(chunk, enc, done) {
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
