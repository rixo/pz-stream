'use strict';

const Stream = require('readable-stream');
const Transform = Stream.Transform;
const util = require('util');

util.inherits(Split, Transform);

module.exports = Split;

Split.obj = require('./obj')(Split);

Split.prototype._transform = _transform;
Split.prototype.split = split;

function Split(options) {
  if (!(this instanceof Split)) {
    return new Split(options);
  }
  if (!options) {
    options = {};
  }
  Transform.call(this, options);

  this._options = options;
  this._splits = [];

  this._out = new Stream.Writable(options);
  this._out._write = (chunk, end, done) => {
    this.push(chunk);
    done();
  };
  this._out.on('finish', () => this.end());

  this.on('end', () => {
    this._splits.forEach(
      split => split.stream.emit('end')
    );
  });

  this.on('error', err => {
    this._splits.forEach(
      split => split.stream.emit('error', err)
    );
  });
}

function _transform(chunk, encoding, done) {
  var target = this._out;
  this._splits.some(split => {
    if (split.test(chunk, encoding)) {
      target = split.stream;
      return true;
    }
  });
  target.write(chunk, encoding);
  done();
}

function split(name, pattern) {
  const stream = new Split(this._options);
  stream.name = name;
  this[name] = stream;
  const split = {
    stream: stream
  };
  if (typeof pattern === 'function') {
    split.test = pattern;
  } else {
    //split.test = file => splitTest(pattern, file);
    throw new Error('Unsupported')
  }
  this._splits.push(split);
  return this;
}
