'use strict';

const Stream = require('readable-stream');
const PassThrough = Stream.PassThrough;
const util = require('util');
const PzBase = require('./PzBase');

util.inherits(Merge, PassThrough);

module.exports = Merge;

Merge.obj = require('./obj')(Merge).obj;
Merge.raw = require('./obj')(Merge).raw;

Merge.prototype._doEnd = Stream.PassThrough.prototype.end;
Merge.prototype.end = end;
Merge.prototype.resume = resume;

Merge.prototype.merge = merge;

function Merge(options) {
  if (!(this instanceof Stream.Transform)) {
    return new Merge(options);
  }
  PzBase.call(this, Merge, options);
  PassThrough.call(this, this._options);

  this._sources = [];
  this._ends = 0;

  this.setMaxListeners(0);

  this.on('pipe', stream => add.call(this, stream));
  this.on('unpipe', stream => remove.call(this, stream));
}

function add(source) {
  if (Array.isArray(source)) {
    source.forEach(s => this.merge(s));
  }
  const sources = this._sources;
  sources.push(source);
  source.once('end', () => {
    if (~sources.indexOf(source)) {
      if (++this._ends >= sources.length) {
        if (this._readableState.flowing) {
          this._doEnd();
        }
      }
    }
  });
}

function remove(stream) {
  const sources = this._sources;
  sources.splice(sources.indexOf(stream), 1);
  if (!this._sources.length && this._readableState.flowing) {
    //this._doEnd();
  }
}

function end() {
  if (this._ends >= this._sources.length) {
    this._doEnd();
  }
}

function resume() {
  Stream.PassThrough.prototype.resume.apply(this, arguments);
  if (this._ends >= this._sources.length) {
    this._doEnd();
  }
  return this;
}

function merge() {
  Array.prototype.slice.call(arguments).forEach(source => {
    if (Array.isArray(source)) {
      source.forEach(s => s.pipe(this));
    } else {
      source.pipe(this);
    }
  });
  return this;
}
