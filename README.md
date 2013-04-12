# digest-stream

Simple node.js pass-through stream (RW) which calculates the a crypto digest (sha/md5 hash) of a stream and also the length. Pipe your stream through this to get digest and length. (streams2)

[![Build Status](https://secure.travis-ci.org/jeffbski/digest-stream.png?branch=master)](http://travis-ci.org/jeffbski/digest-stream)

## Installation


```bash
npm install digest-stream
```

## Usage

Provide a the digest algorithm, optional input encoding, digest encoding, and a listener function when you construct the stream. The listener will be called with the resultant digest and length of the stream just prior to end being emitted.

Since this uses the node.js crypto package, refer to http://nodejs.org/api/crypto.html for the specific options available.

 - `digestStream(algorithm, [inputEncoding,] digestEncoding, [options], listenerFn)` - constructs a new stream instance, the listenerFn will be called prior to the `end` event being emitted. `inputEncoding` is optional and defaults to `binary` if not provided.
 - `options` - optional streams options
 - `listenerFn` function signature is `fn(digest, dataLength)` - `digest` is the digest for the stream data in the digest encoding format specified when instance was created. `dataLength` is the length of the data in the stream (provided for convenience).

```javascript
var digestStream = require('digest-stream');
var digest;
var dataLength;
function listenerFn(resultDigest, length) {
  digest = resultDigest;
  dataLength = length;
}
var dstream = digestStream('sha1', 'hex', listenerFn); // create instance
readstream
  .pipe(dstream) // digest and length calculated as it passes through
  .pipe(...)
```

## Goals

 - Easy to use pass-through stream which calculates the digest and length of string or Buffer streamlength of the string
 - Builds on pass-stream to have all the normal pass-through functionality for a spec compliant stream
 - works with node 0.10+ streams2 but is also compatible with 0.8

## Why

By making this simple pass-through stream which calculates the digest and length of a stream, it becomes really easy to add this functionality to a streaming workflow, just by piping it through this stream, the digest and length will be available prior to `end` being fired.
## Get involved

If you have input or ideas or would like to get involved, you may:

 - contact me via twitter @jeffbski  - <http://twitter.com/jeffbski>
 - open an issue on github to begin a discussion - <https://github.com/jeffbski/digest-stream/issues>
 - fork the repo and send a pull request (ideally with tests) - <https://github.com/jeffbski/digest-stream>

## License

 - [MIT license](http://github.com/jeffbski/digest-stream/raw/master/LICENSE)

