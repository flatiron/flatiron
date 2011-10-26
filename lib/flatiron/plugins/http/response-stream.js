/*
 * response-stream.js: A Stream focused on writing any relevant information to 
 * a raw http.ServerResponse object.
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
var ResponseStream = exports.ResponseStream = function (options) {
  options = options || {};
  HttpStream.call(this, options);
};

ResponseStream.prototype.pipe = function () {
  
};

//
//
//
ResponseStream.prototype.onPipe = function (req) {
  
};