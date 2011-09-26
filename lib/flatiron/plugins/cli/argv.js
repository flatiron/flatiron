/*
 * argv.js: Plugin exposing optimist features to Flatiron applications
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var optimist = require('optimist');

//
// ### function (app, options, done)
// #### @app {broadway.App} Application to extend
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Extends the application with functionality from `node-optimist`.
//
exports.init = function (app, options, done) {
  options = options || app.config.system.argv || {};
  
  if (!Object.keys(options).length) {
    app.argv = optimist.argv;
  }
  else {
    app.argv = optimist.options(options).argv;
  }
  
  done();
};