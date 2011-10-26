/*
 * buffered-stream.js: A simple(r) Stream which is partially buffered into memory.
 *
 * (C) 2010, Mikeal Rogers
 * 
 * Adapted for Flatiron
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var fs = require('fs'), 
    stream = require('stream'), 
    util = require('util');

var BufferedStream = exports.BufferedStream = function (limit) {
  if (typeof limit === 'undefined') {
    limit = Infinity;
  }
  
  this.limit = limit;
  this.size = 0;
  this.chunks = [];
  this.writable = true;
  this.readable = true;
};

util.inherits(BufferedStream, stream.Stream);

BufferedStream.prototype.pipe = function () {
  //
  // TODO: Support multiple destinations
  //
  var dest = this.dest = arguments[0];
  if (this.resume) {
    this.resume();
  }
  
  stream.Stream.prototype.pipe.apply(this, arguments);
  this.chunks.forEach(function (c) {dest.write(c)})
  this.size = 0;
  
  delete this.chunks;
};

BufferedStream.prototype.write = function (chunk) {
  if (this.dest) {
    this.emit('data', chunk);
    return;
  }
  
  this.chunks.push(chunk);
  this.size += chunk.length;
  
  if (this.limit < this.size) {
    this.pause();
  }
};

BufferedStream.prototype.end = function () {
  this.emit('end');
};

if (!stream.Stream.prototype.pause) {
  BufferedStream.prototype.pause = function() {
    this.emit('pause');
  };
}
if (!stream.Stream.prototype.resume) {
  BufferedStream.prototype.resume = function() {
    this.emit('resume');
  };
}