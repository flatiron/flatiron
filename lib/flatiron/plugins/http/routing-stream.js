/*
 * routing-stream.js: A Stream focused on connecting an arbitrary RequestStream and
 * ResponseStream through a given Router.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var util = require('util'),
    HttpStream = require('./http-stream'),
    RequestStream = require('./request-stream'),
    ResponseStream = require('./response-stream');

//
// ### function RequestStream (options) 
// 
//  
var RoutingStream = exports.RoutingStream = function (options) {
  options = options || {};
  HttpStream.call(this, options);
  
  this.streams = {};
  this.streams.req = new RequestStream();
  this.streams.res = new ResponseStream();
};

//
// Called when this instance is piped to **by another stream**
//
RoutingStream.prototype.onPipe = function (req) {
  //
  // When a `RoutingStream` is piped to, dispatch to the router
  // associated with it. It is the responsibility of the router to support
  // the `{ stream: true }` option. If  `{ stream: true }` is not set, then 
  // we will ask the 
  //
};

RoutingStream.prototype.write = function () {
  //
  // Ignore all calls to `.write()`, instances of `RoutingStream` 
  // are only valid pipe targets.
  //
};