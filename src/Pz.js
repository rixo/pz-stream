'use strict';

module.exports = Pz;

Pz.obj = obj;
//Pz.obj.Split = Split.obj;
//Pz.obj.Box = Box.obj;
//Pz.obj.Merge = Merge.obj;

function Pz() {

}

function obj(options) {
  if (!options) {
    options = {};
  }
  options.objectMode = true;
  return new Pz(options);
}
