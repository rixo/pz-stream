'use strict';

const Stream = require('readable-stream');
const Transform = Stream.Transform;
const util = require('util');

util.inherits(Reset, Transform);

module.exports = Reset;

Reset.obj = obj;

Reset.prototype._transform = _transform;
//Reset.prototype._flush = _flush;
Reset.prototype.reset = reset;

function Reset(options) {
  if (!(this instanceof Reset)) {
    return new Reset(options);
  }

  if (options) {
    if (typeof options === 'function') {
      options = {
        factory: options
      };
    }
  } else {
    options = {};
  }

  // TODO test only
  if (!options.factory) {
    options.factory = function() {
      return new Stream.PassThrough();
    };
  }

  Transform.call(this, options);

  this._options = options;

  this._out = new Stream.Writable({
    objectMode: options.objectMode,
    write: (chunk, enc, done) => {
      this.push(chunk);
      done();
    }
  });

  this._in = new Stream.Readable({
    objectMode: options.objectMode,
    read: () => {}
  });

  //this.on('end', () => this._in.end());
  //this._out.on('finish', () => {
  //  this.emit('finish');
  //  this.reset();
  //});
  this._out.on('error', err => this.emit('error'));

  this._flush = (done) => {
    this.reset();
    done();
  };

  this.reset();
}

function _transform(chunk, enc, done) {
  this._in.push(chunk);
  done();
}

function reset() {
  const _in = this._in;
  const _out = this._out;
  const previous = this._stream;
  const stream = this._options.factory();
  if (previous) {
    _in.unpipe(previous);
    previous.unpipe(_out);
  }
  this._stream = stream;
  _in
    .pipe(stream)
    .pipe(_out);
}

function obj(options) {
  if (typeof options === 'function') {
    options = {
      factory: options,
      objectMode: true
    };
  } else if (!options) {
    options = {
      objectMode: true
    };
  } else if (options.objectMode == null) {
    options.objectMode = true;
  }
  return new Reset(options);
}
