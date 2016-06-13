'use strict';

module.exports = function(Stream) {

  return {
    obj: obj,
    raw: raw
  };

  function obj(options) {
    if (!options) {
      options = {};
    }
    if (options.objectMode == null) {
      options.objectMode = true;
    }
    return new Stream(options);
  }

  function raw(options) {
    if (!options) {
      options = {};
    }
    if (options.objectMode == null) {
      options.objectMode = false;
    }
    return new Stream(options);
  }
};
