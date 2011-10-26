/*
 * http-stream.js: Idomatic buffered stream which pipes additional HTTP information.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var util = require('util'),
    BufferedStream = require('./buffered-stream');
    
var HttpStream = exports.HttpStream = function (options) {
  options = options || {};
  BufferedStream.call(this, options.limit);
  
  this.on('pipe', this.onPipe);
};

util.inherits(HttpStream, BufferedStream);
