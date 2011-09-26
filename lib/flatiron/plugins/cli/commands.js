/*
 * commands.js: Plugin exposing a simple command pattern to Flatiron applications
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

//
// ### Name this plugin
//
exports.name = 'commands';

//
// ### function init (options, done)
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Extends `this` (the application) with a simple command pattern inspired from `jitsu`.
//
exports.init = function (options, done) {
  options = options || {};
  this.commands = {};
  done();
};