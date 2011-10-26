/*
 * core.js: Core functionality for the Flatiron HTTP plugin. 
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var http = require('http'),
    https = require('https'),
    stream = require('stream'),
    HttpStream = require('./http-stream'),
    RoutingStream = require('./routing-stream');
    
var core = exports;

core.createServer = function (options) {
  var streams = Array.prototype.slice.call(arguments).filter(function (str) {
    return typeof str === 'function';
  });
  
  if (typeof options === 'function') {
    options = {};
  }
  
  //
  // TODO: Create HTTPS server is `options` is present.
  //
  return http.createServer(core.stack(streams));
}

core.stack = function stack(/*streams*/) {
  var streams = Array.prototype.slice.call(arguments),
      error = core.errorHandler;
  
  //
  // Add our `RoutingStream` for multiplexing core
  // application logic. 
  //
  streams.push(RoutingStream);
  
  return function (req, res) {
    var handlers = new Array(streams.length);
    
    //
    // 1. Instantiate all the Streams in the pipe
    //    chain for this `request` / `response` pair.
    //
    for (var i = 0; i < streams.length; i++) {
      //
      // Remark: How to pass options to these stream instances
      //
      handlers[i] = new (streams[i])();
    }
    
    //
    // 2. Add the raw `http.ServerRequest` and `http.ServerResponse` 
    //    objects to the pipe chain
    //
    handlers.unshift(req);
    handlers.push(res);
    
    //
    // 3. Start the pipe chain.
    //
    for (var i = 0; i < handlers.length - 1; i++) {
      handlers[i].pipe(handlers[i + 1]);
      handlers[i].on('error', error);
    }
  }
};

core.errorHandler = function error(err) {
  if (err) {
    console.error(err.stack);
    this.res.writeHead(500, {"Content-Type": "text/plain"});
    this.res.end(err.stack + "\n");
    return;
  }
  this.res.writeHead(404, {"Content-Type": "text/plain"});
  this.res.end("Not Found\n");
};