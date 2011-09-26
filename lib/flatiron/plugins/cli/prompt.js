/*
 * prompt.js: Plugin exposing prompt features to Flatiron applications
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var prompt = require('prompt');

//
// ### function init (options, done)
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Extends `this` (the application) with functionality from `node-prompt`.
//
exports.init = function (options, done) {
  var self = this;
  options  = options || {};
  
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
      self.emit.apply(app, [['prompt', ev]].concat(args));
    });
  });
  
  //
  // Extend `this` (the application) with prompt functionality
  // and open `stdin`.
  //
  this.prompt = prompt;
  this.prompt.start().pause();
  
  done();
};