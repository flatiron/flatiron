/*
 * index.js: Top-level plugin exposing CLI features in flatiron
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var async = require('async');

//
// ### function (app, options, done)
// #### @app {broadway.App} Application to extend
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Initializes the core `cli` plugins which consists of `argv`, 
// `commands`, and `prompt` in that order. 
//
exports.init = function (app, options, done) {
  async.forEach(['argv', 'commands', 'prompt'], function _init(plugin, next) {
    app.plugins[plugin] = app.plugins[plugin] || require('./' + plugin);
    app._attach(plugin, options[plugin] || app._options[plugin], next);
  }, done);
};