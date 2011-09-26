/*
 * commands.js: Plugin exposing a simple command pattern to Flatiron applications
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

//
// ### function (app, options, done)
// #### @app {broadway.App} Application to extend
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Extends the application with a simple command pattern inspired from `jitsu`.
//
exports.init = function (app, options, done) {
  options = options || {};
  app.commands = {};
  done();
};