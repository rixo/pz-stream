'use strict';

module.exports = function(Stream) {

  return obj;

  function obj(options) {
    if (!options) {
      options = {};
    }
    if (options.objectMode == null) {
      options.objectMode = true;
    }
    return new Stream(options);
  }
};
