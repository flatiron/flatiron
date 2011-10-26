/*
 * request-stream.js: A Stream focused on reading any relevant information from 
 * a raw http.ServerRequest object.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var util = require('util'),
    HttpStream = require('./http-stream');

//
// ### function RequestStream (options) 
// 
//  
var RequestStream = exports.RequestStream = function (options) {
  options = options || {};
  HttpStream.call(this, options);
};

//
// Called when this instance is piped **to** by another stream
//
RequestStream.prototype.onPipe = function (req) {
  
};

RequestStream.prototype.__defineGetter__('body', function () {
  
});