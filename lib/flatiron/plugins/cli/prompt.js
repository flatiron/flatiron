/*
 * prompt.js: Plugin exposing prompt features to Flatiron applications
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var prompt = require('prompt');

//
// ### function (app, options, done)
// #### @app {broadway.App} Application to extend
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Extends the application with functionality from `node-prompt`.
//
exports.init = function (app, options, done) {
  options = options || {};
  
  //
  // Pass-thru any prompt specific options that are supplied.
  //
  prompt.allowEmpty = options.allowEmpty || prompt.allowEmpty;
  prompt.message    = options.message    || prompt.message;
  prompt.delimiter  = options.delimiter  || prompt.delimiter;
  prompt.properties = options.properties || prompt.properties;
  
  //
  // Hoist up any prompt specific events and re-emit them as
  // `prompt::*` events.
  //
  ['start', 'pause', 'resume', 'prompt', 'invalid'].forEach(function (ev) {
    prompt.on(ev, function () {
      var args = Array.prototype.slice.call(arguments);
      app.emit.apply(app, [['prompt', ev]].concat(args));
    });
  });
  
  //
  // Extend the application with prompt functionality and 
  // open `stdin`.
  //
  app.prompt = prompt;
  app.prompt.start().pause();
  
  done();
};