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
    common = broadway.common,
    directories = common.directories,
    constants = require('./constants');

var App = exports.App = function (options) {
  var self = this;

  broadway.App.call(this, options);

  // Allow multiple start functions
  Object.defineProperty(this, 'start', {
    configurable: false,

    get: function () {
      return App.prototype.start.bind(self);
    },

    set: function (value) {
      if (!Array.isArray(self.startQueue)) self.startQueue = [];
      if (typeof value !== 'function') return;

      self.startQueue.push(value);

      return self.start;
    }
  });
};

//
// Inherit from `broadway.App`.
//
util.inherits(App, broadway.App);

//
// ### function init (callback)
// #### @callback {function} Continuation to respond to when complete.
// Initializes this instance of `flatiron.App`
//
App.prototype.init = function () {
  broadway.App.prototype.init.apply(this, Array.prototype.slice.call(arguments));
};


App.prototype.start = function () {
  var args = arguments,
      self = this;

  return this.startQueue.map(function (start) {
    try {
      return start.apply(self, args);
    }
    catch (e) {
      return e;
    }
  });
};
