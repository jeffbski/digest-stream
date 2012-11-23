'use strict';

var crypto = require('crypto');
var passStream = require('pass-stream');

function digestStream(algorithm, inputEncoding, digestEncoding, listenerFn) {
  if (arguments.length < 3) throw new Error('digestStream requires algorithm, digestEncoding, and listenerFn');
  if (arguments.length === 3 && typeof digestEncoding === 'function') { // inputEncoding not provided, shift
    listenerFn = digestEncoding;
    digestEncoding = inputEncoding;
    inputEncoding = 'binary';
  }
  if (typeof listenerFn !== 'function') throw new Error('digestStream listenerFn needs to be a function');
  inputEncoding = inputEncoding || 'binary';  // if inputEncoding is null or undefined, default to binary

  var digester = crypto.createHash(algorithm);
  var length = 0;

  function writeFn(data) {
    /*jshint validthis:true */
    digester.update(data, inputEncoding);
    length += data.length;
    this.queueWrite(data);
  }
  function endFn() {
    /*jshint validthis:true */
    listenerFn(digester.digest(digestEncoding), length);
    this.queueEnd();
  }
  var stream = passStream(writeFn, endFn);
  return stream;
}

module.exports = digestStream;