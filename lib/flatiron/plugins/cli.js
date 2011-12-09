/*
 * index.js: Top-level plugin exposing CLI features in flatiron
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var director = require('director'),
    optimist = require('optimist'),
    path = require('path');

//
// ### Name this plugin
//
exports.name = 'cli';

//
// ### function attach (options, done)
// #### @options {Object} Options for this plugin
// Initializes `this` (the application) with the core `cli` plugins consisting of:
// `argv`, `prompt`, `routing`, `commands` in that order. 
//
exports.attach = function (options) {
  var app = this;  
  options = options || {};
  
  //
  // Setup `this.argv` to use `optimist`.
  //
  exports.argv.call(this, options.argv);  
  
  //
  // Setup `this.prompt`.
  //
  exports.prompt.call(this, options.prompt);
  
  //
  // Setup `app.router` and associated core routing method.
  //
  app.cli    = {}
  app.router = new director.cli.Router().configure({
    async: app.async || options.async
  });
  
  app.start = function (options, callback) {
    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }
    
    callback = callback || function () {};
    app.init(options, function (err) {
      if (err) {
        return callback(err);
      }
      
      app.router.dispatch('on', app.argv._.join(' '), app.log, callback);
    });
  };
  
  app.cmd = function (path, handler) {
    app.router.on(path, handler);
  };
  
  exports.commands.call(this, options);
};

//
// ### function init (done)
// #### @done {function} Continuation to respond to when complete
// Initializes this plugin by setting `winston.cli` (i.e. `app.log.cli`)
// to enable colors and padded levels.
//
exports.init = function (done) {
  var app = this,
      logger;

  if (!app.log.help) {
    logger = app.log.get('default');
    logger.cli().extend(app.log);
  }
  
  done();
};

//
// ### function argv (options)
// #### @options {Object} Pass-thru options for optimist
// Sets up `app.argv` using `optimist` and the specified options.
//
exports.argv = function (options) {
  if (options && Object.keys(options).length) {
    this.argv = require('optimist').options(options).argv;
  }
  else {
    this.argv = require('optimist').argv;
  }
};

//
// ### function commands (options)
// #### @
//
exports.commands = function (options) {
  var app = this;
  
  function showUsage(target) {
    target = Array.isArray(target) ? target : target.split('\n');
    target.forEach(function (line) {
      app.log.help(line);
    });
  }
  
  //
  // Setup any pass-thru options to the 
  // application instance but make them lazy
  //
  app.usage = options.usage;
  app.cli.dir = options.dir;
  app.commands = {};
  
  //
  // Helper function which loads the file for the
  // specified `name` into `app.commands`.
  //
  function loadCommand(name, silent) {
    if (app.cli.dir) {    
      if (app.commands[name]) {
        return;
      }
      try {
        command = app.commands[name] = require(path.join(app.cli.dir, name));
        return true;
      }
      catch (err) {
        if (!err.message.match(/^Cannot find module/)) {
          throw err;
        }

        if (!silent) {
          showUsage(app.usage || [
            'Cannot find commands for ' + name.magenta
          ]);
        }
        
        return false;
      }
    }
  }
  
  //
  // Helper function which executes the command
  // represented by the Array of `parts` passing
  // control to the `callback`.
  //
  function executeCommand(parts, callback) {
    if (app.cli.dir) {
      var name = parts.shift(),
          command,
          usage;
    
      if (!loadCommand(name)) {
        return callback();
      }
      
      command = app.commands[name];
      while (command) {
        usage = command.usage;
      
        if (!app.argv.h && !app.argv.help && typeof command === 'function') {
          while (parts.length + 1 < command.length) {
            parts.push(null);
          }
          
          command.apply(this, parts.concat(callback));
          return;
        }
        
        command = command[parts.shift()];
      }
    
      //
      // Since we have not resolved a needle, try and print out a usage message
      //
      if (usage || options.usage) {
        showUsage(usage || options.usage)
      }
    }
    else if (app.usage) {
      //
      // If there's no directory we're supposed to search for modules, simply
      // print out usage notice if it's provided.
      //
      showUsage(options.usage);
    }
  }
  
  //
  // Allow commands to be aliased to subcomponents. e.g.
  //
  //    app.alias('list', { resource: 'apps', command: 'list' });
  //
  app.alias = function (target, source) {
    app.commands.__defineGetter__(target, function () {
      loadCommand(source.resource, true);
      var resource = app.commands[source.resource];
      
      if (resource) {
        return resource[source.command];
      }
    });
  };
  
  //
  // Set the `loadCommand` function to run 
  // whenever the router has not matched 
  // the CLI arguments, `process.argv`.
  //
  app.router.notfound = function (callback) {
    executeCommand(app.argv._.slice(), callback);
  };
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
