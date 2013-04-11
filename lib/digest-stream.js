'use strict';

var crypto = require('crypto');
var passStream = require('pass-stream');

function digestStream(algorithm, inputEncoding, digestEncoding, options, listenerFn) {
  if (arguments.length < 3) throw new Error('digestStream requires algorithm, digestEncoding, and listenerFn');
  if (typeof digestEncoding !== 'string') { // inputEncoding not provided, shift
    listenerFn = options;
    options = digestEncoding;
    digestEncoding = inputEncoding;
    inputEncoding = 'binary';
  }
  if (typeof options === 'function') { // options not provided, shift
    listenerFn = options;
    options = {};
  }
  if (typeof listenerFn !== 'function') throw new Error('digestStream listenerFn needs to be a function');
  inputEncoding = inputEncoding || 'binary';  // if inputEncoding is null or undefined, default to binary

  var digester = crypto.createHash(algorithm);
  var length = 0;

  function writeFn(data, encoding, cb) {
    /*jshint validthis:true */
    digester.update(data, inputEncoding);
    length += data.length;
    this.push(data);
    cb();
  }
  function endFn(cb) {
    /*jshint validthis:true */
    listenerFn(digester.digest(digestEncoding), length);
    cb();
  }
  var stream = passStream(writeFn, endFn, options);
  return stream;
}

module.exports = digestStream;