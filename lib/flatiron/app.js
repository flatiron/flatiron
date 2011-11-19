/*
 * app.js: Core Application object for managing plugins and features in broadway
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    broadway = require('broadway'),
    directories = broadway.common.directories,
    constants = require('./constants');

var App = exports.App = function (options) {
  broadway.App.call(this, options);
};

//
// Inherit from `broadway.App`.
//
util.inherits(App, broadway.App);

//
// ### function init (options, callback)
// #### @callback {function} Continuation to respond to when complete.
// Initializes this instance of `flatiron.App`
//
App.prototype.init = function (callback) {
  callback = callback || function () {};
  // this.options.directories = options.directories || directories.normalize(this.root, constants.DIRECTORIES);
  // this.options.config = broadway.mixin({}, this.options.config || {}, { sources: configSettings.call(this) }); 
  
  broadway.App.prototype.init.call(this, callback);
};

//
// Helper function for generating default configuration
// settings for App instances.
//
function configSettings() {
  var sources = [],
      configDir = this.options.directories['config'],
      envDir = this.options.directories['env'];
  
  tryReaddirSync(configDir).forEach(function (file) {
    if (path.extname(file) === '.json') {
      sources.push({
        file: path.join(configDir, file),
        name: path.basename(file),
        type: 'file'
      });
    }
  });

  return sources;
}

function tryReaddirSync(dir) {
  try { return fs.readdirSync(dir) }
  catch (err) { return [] }
}