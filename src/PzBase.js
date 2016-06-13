'use strict';

module.exports = PzBase;

function PzBase(constructor, options) {
  if (!options) {
    options = {};
  }

  if (typeof options.objectMode === 'undefined') {
    options.objectMode = constructor.defaultObjectMode || require('./Pz').defaultObjectMode;
  }

  this._options = options;
}
