/*
 * index.js: Top-level plugin exposing CLI features in flatiron
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var sugarskull = require('sugarskull'),
  optimist = require('optimist'),
  winston = require('winston'),
  path = require('path');

//
// ### Name this plugin
//
exports.name = 'cli';

//
// ### function attach (options, done)
// #### @options {Object} Options for this plugin
// Initializes `this` (the application) with the core `cli` plugins consisting of:
// `argv`, `commands`, and `prompt` in that order. 
//
exports.attach = function (options) {
  var self = this;  
  options = options || {};
  
  //
  // Setup `this.argv` to use `optimist`.
  //
  exports.argv.call(this, options);
  
  //
  // Setup `this.commands`.
  //
  exports.commands.call(this, options);
  
  //
  // Setup `this.prompt`.
  //
  exports.prompt.call(this, options.prompt);
  
  //
  // Setup `self.router` and associated core routing method.
  //
  self.cli = {};
  self.cli.router = new sugarskull.cli.Router().configure({
    async: self.async || options.async
  });
  
  self.start = function (callback) {
    self.cli.router.dispatch('on', process.argv.slice(2).join(' '), self.log, callback);
  };
  
  if(options.dir) {
    self.cli.router.notfound = function findModule(callback) {
      var parts = optimist.argv._,
        needle,
        usageTarget = options;
      
      try {
        needle = require(path.join(options.dir, parts.shift()));
      }
      catch (e) {
        // ignore, try for usage
      }
      while (needle) {
        if (needle.usage) {
          usageTarget = needle
        }
        if (!this.params.h && !this.params.help && typeof needle === 'function' && needle.length === parts.length) {
          needle.apply(this, parts.concat(callback));
          return;
        }
        needle = needle[parts.shift()];
      }
      //
      // Since we have not resolved a needle, try and print out a usage message
      //
      if (usageTarget) {
        console.log([].concat(usageTarget.usage).join('\n'));
      }
    };
  }
  
  self.cmd = function (path, handler) {
    self.cli.router.on(path, handler);
  };
};

exports.argv = function (options) {
  if (options.argv && Object.keys(options.argv).length) {
    this.argv = require('optimist').options(options).argv;
  }
  else {
    this.argv = require('optimist').argv;
  }
};

exports.commands = function (options) {
  this.commands = {};
};

exports.prompt = function (options) {
  options = options || {};
  
  this.__defineGetter__('prompt', function () {
    if (!this._prompt) {
      //
      // Pass-thru any prompt specific options that are supplied.
      //
      var prompt = require('prompt'),
          self = this;
        
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
          self.emit.apply(self, [['prompt', ev]].concat(args));
        });
      });
    
      //
      // Extend `this` (the application) with prompt functionality
      // and open `stdin`.
      //
      this._prompt = prompt;
      this._prompt.start().pause();
    }
    
    return this._prompt;
  });
};