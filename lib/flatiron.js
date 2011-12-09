/*
 * flatiron.js: An elegant blend of convention and configuration for building apps in Node.js and the browser.
 *
 * Copyright(c) 2011 Nodejitsu Inc. <info@nodejitsu.com>
 * MIT LICENCE
 *
 */

var fs = require('fs'),
    broadway = require('broadway');
 
var flatiron = exports,
    _app;

//
// Expose version through `pkginfo`
//
require('pkginfo')(module, 'version');

//
// ### Export core `flatiron` modules 
//
flatiron.common    = broadway.common.mixin(broadway.common, require('./flatiron/common'));
flatiron.constants = require('./flatiron/constants');
flatiron.App       = require('./flatiron/app').App;

//
// ### Expose core `flatiron` plugins
// Hoist those up from `broadway` and define each of 
// the `flatiron` plugins as a lazy loaded `require` statement
//
flatiron.plugins = broadway.plugins;
fs.readdirSync(__dirname + '/flatiron/plugins').forEach(function (plugin) {
  plugin = plugin.replace('.js', '');
  flatiron.plugins.__defineGetter__(plugin, function () {
    return require('./flatiron/plugins/' + plugin);
  });
});

//
// ### getter @app {flatiron.App} 
// Gets the default top-level Application for `flatiron`
//
flatiron.__defineGetter__('app', function () {
  if (!_app) {
    _app = new flatiron.App();
  }
  
  return _app;
});

//
// ### setter @app {flatiron.App} 
// Sets the default top-level Application for `flatiron`
//
flatiron.__defineSetter__('app', function (value) {
  _app = value;
});

//
// ### function createApp (options)
// #### @options {Object} Options for the application to create
// Creates a new instance of `flatiron.App` with the 
// specified `options`.
//
flatiron.createApp = function (options) {
  return new flatiron.App(options);
};