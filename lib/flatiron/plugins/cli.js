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
  exports.argv.call(this, options);
  
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
  if (options.argv && Object.keys(options.argv).length) {
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

      // app.log.help doesn't exist. Should it?
      if (app.log && app.log.help) {
        app.log.help(line);
      }
      else {
        console.log(line);
      }
    });
  }
  
  //
  // Setup any pass-thru options to the 
  // application instance but make them lazy
  //
  app.usage = options.usage;
  app.cli.dir = options.dir;
  app.commands = {};
  
  function loadCommand(parts) {
    if (app.cli.dir) {
      var part = parts.shift(),
          command,
          usage;
    
      if (app.commands[part]) {
        command = app.commands[part];
      }
      else {
        try {
          command = app.commands[part] = require(path.join(options.dir, part));
        }
        catch (err) {
          if (!err.message.match(/^Cannot find module/)) {
            throw err;
          }

          //
          // TODO: No module; Go for the usage.
          //
          return showUsage(options.usage || [
            'Cannot find commands for ' + part.magenta
          ]);
        }
      }
    
      while (command) {
        usage = command.usage;
      
        if (!app.argv.h && !app.argv.help && typeof command === 'function' 
          && command.length <= parts.length) {
          return command;
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
  
  app.alias = function (target, source) {
    app.commands.__defineGetter__(target, function () {
      var resource = app.commands[source.resource];
      
      if (resource) {
        return resource[source.command];
      }
      
      return loadCommand([source.resource, source.command]);
    });
  };
  
  //
  // Set the `loadCommand` function to run 
  // whenever the router has not matched 
  // the CLI arguments, `process.argv`.
  //
  app.router.notfound = function (callback) {
    var invoke = loadCommand(app.argv._.slice());


    if (invoke) {
      invoke.apply(this, (invoke.args || []).concat(callback));
    }
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
