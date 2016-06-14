'use strict';

const util = require('util');
const Box = require('./Box');
const Merge = require('./Merge');
const Split = require('./Split');

util.inherits(Pz, Box);

module.exports = Pz;

Pz.obj = require('./obj')(Pz).obj;
Pz.raw = require('./obj')(Pz).raw;

Pz.defaultObjectMode = true;

Pz.prototype.end = Merge.prototype.end;
Pz.prototype.resume = Merge.prototype.resume;

//Pz.prototype.$ = $;

function Pz(options, parent) {
  if (!(this instanceof Pz)) {
    return new Pz(options, parent);
  }

  Box.call(this, options);
  Merge.call(this, options);

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
