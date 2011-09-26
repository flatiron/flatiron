/*
 * index.js: Top-level plugin exposing CLI features in flatiron
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var async = require('async');

//
// ### Name this plugin
//
exports.name = 'cli';

//
// ### function init (options, done)
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Initializes `this` (the application) with the core `cli` plugins consisting of:
// `argv`, `commands`, and `prompt` in that order. 
//
exports.init = function (options, done) {
  var self = this;
  
  async.forEach(['argv', 'commands', 'prompt'], function _init(plugin, next) {
    self.plugins[plugin] = self.plugins[plugin] || require('./' + plugin);
    self.attach(plugin, options[plugin] || self.options[plugin], next);
  }, done);
};