/*global suite:false test:false */
'use strict';

var crypto = require('crypto');
var chai = require('chai-stack');
var digestStream = require('..'); // require('digest-stream');
var passStream = require('pass-stream');

var t = chai.assert;

suite('basic');

var EXPECTED_SHA1_HEX = crypto.createHash('sha1').update('abcdefghi').digest('hex');
var EXPECTED_MD5_BASE64 = crypto.createHash('md5').update('abcdefghi').digest('base64');

test('basic use string, results with digest and length being provided to listener before end', function (done) {
  var resultDigest;
  var resultantLength;
  function listenerFn(digest, length) {
    resultDigest = digest;
    resultantLength = length;
  }
  var ls = digestStream('sha1', 'hex', listenerFn);
  var stream = passStream();
  var accumData = [];
  stream
    .pipe(ls)
    .on('error', function (err) { done(err); })
    .on('data', function (data) { accumData.push(data); })
    .on('end', function () {
      t.deepEqual(Buffer.concat(accumData).toString(), 'abcdefghi');
      t.equal(resultDigest, EXPECTED_SHA1_HEX);
      t.equal(resultantLength, 9);
      done();
    });
  process.nextTick(function () {
    stream.write('abc');
    stream.write('def');
    stream.end('ghi');
  });
});

test('basic use Buffer, results with digest and length being provided to listener before end', function (done) {
  var resultDigest;
  var resultantLength;
  function listenerFn(digest, length) {
    resultDigest = digest;
    resultantLength = length;
  }
  var ls = digestStream('sha1', 'hex', listenerFn);
  var stream = passStream();
  var accumData = [];
  stream
    .pipe(ls)
    .on('error', function (err) { done(err); })
    .on('data', function (data) { accumData.push(data); })
    .on('end', function () {
      t.deepEqual(accumData, [new Buffer('abc'), new Buffer('def'), new Buffer('ghi')]);
      t.equal(resultDigest, EXPECTED_SHA1_HEX);
      t.equal(resultantLength, 9);
      done();
    });
  process.nextTick(function () {
    stream.write(new Buffer('abc'));
    stream.write(new Buffer('def'));
    stream.end(new Buffer('ghi'));
  });
});

test('basic use Buffer, md5/base64 results with digest and length being provided to listener before end', function (done) {
  var resultDigest;
  var resultantLength;
  function listenerFn(digest, length) {
    resultDigest = digest;
    resultantLength = length;
  }
  var ls = digestStream('md5', 'base64', listenerFn);
  var stream = passStream();
  var accumData = [];
  stream
    .pipe(ls)
    .on('error', function (err) { done(err); })
    .on('data', function (data) { accumData.push(data); })
    .on('end', function () {
      t.deepEqual(accumData, [new Buffer('abc'), new Buffer('def'), new Buffer('ghi')]);
      t.equal(resultDigest, EXPECTED_MD5_BASE64);
      t.equal(resultantLength, 9);
      done();
    });
  process.nextTick(function () {
    stream.write(new Buffer('abc'));
    stream.write(new Buffer('def'));
    stream.end(new Buffer('ghi'));
  });
});

test('basic use string with inputEncoding utf8, results with listenerFn(digest, len) before end', function (done) {
  var resultDigest;
  var resultantLength;
  function listenerFn(digest, length) {
    resultDigest = digest;
    resultantLength = length;
  }
  var ls = digestStream('sha1', 'utf8', 'hex', listenerFn);
  var stream = passStream();
  var accumData = [];
  stream
    .pipe(ls)
    .on('error', function (err) { done(err); })
    .on('data', function (data) { accumData.push(data); })
    .on('end', function () {
      t.deepEqual(Buffer.concat(accumData).toString(), 'abcdefghi');
      t.equal(resultDigest, EXPECTED_SHA1_HEX);
      t.equal(resultantLength, 9);
      done();
    });
  process.nextTick(function () {
    stream.write('abc');
    stream.write('def');
    stream.end('ghi');
  });
});

test('all arguments missing for factory, throws error', function () {
  function throwsErr() {
    var stream = digestStream();
  }
  t.throws(throwsErr, /digestStream requires algorithm, digestEncoding, and listenerFn/);
});

test('1 arg provided, throws error', function () {
  function throwsErr() {
    var stream = digestStream('sha1');
  }
  t.throws(throwsErr, /digestStream requires algorithm, digestEncoding, and listenerFn/);
});

test('2 arg provided, throws error', function () {
  function throwsErr() {
    var stream = digestStream('sha1', 'hex');
  }
  t.throws(throwsErr, /digestStream requires algorithm, digestEncoding, and listenerFn/);
});

test('listenerFn not a function, throws error', function () {
  function throwsErr() {
    var stream = digestStream('sha1', 'binary', 'hex', {});
  }
  t.throws(throwsErr, /listenerFn needs to be a function/);
});