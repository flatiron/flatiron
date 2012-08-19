/*
 * socketio.js: Top-level plugin for using socket.io in a Flatiron app
 *
 * (C) 2012, Nodejitsu, Inc.
 * MIT LICENSE
 *
 */

var path = require('path'),
    flatiron = require('../../flatiron'),
    common = flatiron.common,
    socketio;


//
// TODO: Refactor the try / catch / require pattern here
// see: https://github.com/flatiron/broadway/issues/34
//
try {
  //
  // Attempt to require socketio.
  //
  socketio = require('socket.io');
}
catch (ex) {
  //
  // Do nothing since this is a progressive enhancement
  //
  console.warn('flatiron.plugins.socketio requires the `socket.io` module from npm');
  console.warn('install using `npm install socket.io`.');
  console.trace();
  process.exit(1);
}

var union;

try {
  //
  // Attempt to require union.
  //
  union = require('union');
}
catch (ex) {
  //
  // Do nothing since this is a progressive enhancement
  //
  console.warn('flatiron.plugins.http requires the `union` module from npm');
  console.warn('install using `npm install union`.');
  console.trace();
  process.exit(1);
}

exports.name = 'socketio';

exports.attach = function (options) {
  var app = this;

  options = options || {};

  app.start = function (port, host, callback) {
    if (!callback && typeof host === 'function') {
      callback = host;
      host = null;
    }
    app.init(function (err) {
      if (err) {
        if (callback) {
          return callback(err);
        }
        throw err;
      }
      app.listen(port, host, callback);
    });
  };

  app.createServer = function(){
    app.server = union.createServer({
      after: app.http.after,
      before: app.http.before.concat(function (req, res) {
        if (!app.router.dispatch(req, res, app.http.onError || union.errorHandler)) {
          if (!app.http.onError) res.emit('next');
        }
      }),
      headers: app.http.headers,
      limit: app.http.limit,
      https: app.http.https
    });
  };

  app.listen = function (port, host, callback) {
    if (!callback && typeof host === 'function') {
      callback = host;
      host = null;
    }
    app.createServer();
    app.io = socketio.listen(app.server);
    return host
      ? app.server.listen(port, host, callback)
      : app.server.listen(port, callback);
  };

  //
  // Attempt to merge defaults passed to `app.use(flatiron.plugins.socketio)`
  // with any additional configuration that may have been loaded
  options = common.mixin(
    {},
    options,
    app.config.get('socketio') || {}
  );

  app.config.set('socketio', options);

}
