'use strict';

const util = require('util');
const Stream = require('readable-stream');
const Box = require('./Box');
const Merge = require('./Merge');
const Split = require('./Split');

util.inherits(Pz, Box);

module.exports = Pz;

Pz.obj = require('./obj')(Pz).obj;
Pz.raw = require('./obj')(Pz).raw;

Pz.defaultObjectMode = true;

Pz.prototype._doEnd = Box.prototype.end;
Pz.prototype.end = Merge.prototype.end;
Pz.prototype.end = Merge.prototype.end;
Pz.prototype.merge = Merge.prototype.merge;

Pz.prototype._transform = function(chunk, encoding, done) {
  var target;
  this._splits.some(split => {
    if (split.test(chunk, encoding)) {
      target = split.stream;
      return true;
    }
  });
  if (target) {
    target.write(chunk, encoding);
  } else if (this._in) {
    this._in.push(chunk);
  } else {
    this._out.write(chunk, encoding);
  }
  done();
};

Pz.prototype.split = Split.prototype.split;

function Pz(options, parent) {
  if (!(this instanceof Pz)) {
    return new Pz(options, parent);
  }
  Box.call(this, options);
  Merge.call(this, options);
  Split.call(this, options);
}
