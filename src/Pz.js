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

//Pz.prototype.end = function end() {
//  if (this._ends >= this._sources.length) {
//    Box.prototype.end.apply(this, arguments);
//    this._in.push(null);
//  }
//};
Pz.prototype.resume = function resume() {
  Box.prototype.resume.apply(this, arguments);
  if (this._ends >= this._sources.length) {
    Box.prototype.end.call(this);
  }
  return this;
};
//Pz.prototype.end = Merge.prototype.end;
//Pz.prototype.resume = Merge.prototype.resume;

//Pz.prototype._transform = Split.prototype._transform;
Pz.prototype._transform = function(chunk, encoding, done) {
  var target;
  this._splits.some(split => {
    if (split.test(chunk, encoding)) {
      target = split.stream;
      return true;
    }
  });
  //const _ = require('lodash');
  //console.log(this.id, chunk, target, _.map(this._splits, 'test').map(fn => String(fn)))
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

//Pz.prototype.$ = $;

function Pz(options, parent) {
  if (!(this instanceof Pz)) {
    return new Pz(options, parent);
  }

  Box.call(this, options);
  Merge.call(this, options);
  Split.call(this, options);

  this._children = {};
  this._parent = parent;

  //this._split = Split(options);
  //// pipe split into out (that is me)
  //this._split.pipe(this._out);
  //// expose split as ultimate anchor point for box
  //this._out = this._split;
}

function $(name) {
  if (!this._children[name]) {
    this._children[name] = new Pz(null, this);
  }
  return this._children[name];
}
