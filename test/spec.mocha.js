/*global suite:false test:false */
'use strict';

var chai = require('chai-stack');
var spec = require('stream-spec');
var tester = require('stream-tester');
var digestStream = require('..'); // require('digest-stream');

var t = chai.assert;

suite('stream-spec');

test('spec random pausing string stream', function (done) {
  var resultDigest;
  var resultantLength;
  function listenerFn(digest, length) {
    resultDigest = digest;
    resultantLength = length;
  }
  var ds = digestStream('sha1', 'hex', listenerFn);
  spec(ds)
    .through({strict: false})
    .validateOnExit();

  var master = tester.createConsistentStream();

  function gen() {
    return 'abc';
  }

  tester.createRandomStream(gen, 1000) //1k 3char strings
    .pipe(master)
    .pipe(tester.createUnpauseStream())
    .pipe(ds)
    .pipe(tester.createPauseStream())
    .pipe(master.createSlave())
    .on('error', function (err) { done(err); })
    .on('end', function () {
      t.isNotNull(resultDigest);
      t.equal(resultantLength, 3000);
      done();
    });
});

test('spec random pausing Buffer stream', function (done) {
  var resultDigest;
  var resultantLength;
  function listenerFn(digest, length) {
    resultDigest = digest;
    resultantLength = length;
  }
  var ds = digestStream('sha1', 'hex', listenerFn);
  spec(ds)
    .through({strict: false})
    .validateOnExit();

  var master = tester.createConsistentStream();

  function gen() {
    return new Buffer('abc');
  }

  tester.createRandomStream(gen, 1000) //1k 3byte Buffers
    .pipe(master)
    .pipe(tester.createUnpauseStream())
    .pipe(ds)
    .pipe(tester.createPauseStream())
    .pipe(master.createSlave())
    .on('error', function (err) { done(err); })
    .on('end', function () {
      t.isNotNull(resultDigest);
      t.equal(resultantLength, 3000);
      done();
    });
});

