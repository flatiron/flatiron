/*
 * argv.js: Plugin exposing optimist features to Flatiron applications
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var optimist = require('optimist');

//
// ### function init (options, done)
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Extends `this` (the application) with functionality from `node-optimist`.
//
exports.init = function (options, done) {
  options = options || this.config.system.argv || {};
  
  if (!Object.keys(options).length) {
    this.argv = optimist.argv;
  }
  else {
    this.argv = optimist.options(options).argv;
  }
  
  done();
};