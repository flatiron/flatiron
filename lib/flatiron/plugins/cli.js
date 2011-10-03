/*
 * index.js: Top-level plugin exposing CLI features in flatiron
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var sugarskull = require('sugarskull');

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
  self.router = new sugarskull.cli.Router().configure({
    async: self.async || options.async
  });
  
  self.start = function (callback) {
    self.router.dispatch('on', process.argv.slice(2).join(' '), callback);
  };
  
  self.cmd = function (path, handler) {
    self.router.on(path, handler);
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