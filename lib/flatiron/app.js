/*
 * app.js: Core Application object for managing plugins and features in broadway
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var util = require('util'),
    broadway = require('broadway');

var App = exports.App = function (options) {
  broadway.App.call(this, options);
};

//
// Inherit from `broadway.App`.
//
util.inherits(App, broadway.App);

//
// ### function init (options, callback)
// #### @options {Object} **Optional** Options to initialize this instance with
// #### @callback {function} Continuation to respond to when complete.
// Initializes this instance of `flatiron.App`
//
App.prototype.init = function (options, callback) {
  broadway.App.prototype.init.call(this, options, callback);
};