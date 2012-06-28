/*
 * view.js: Top-level plugin exposing views to flatiron app
 *
 * (C) 2012, Nodejitsu, Inc.
 * MIT LICENSE
 *
 */

var path = require('path'),
    fs = require('fs'),
    flatiron = require('../../flatiron'),
    common = flatiron.common;

exports.name = 'view';

exports.attach = function (options) {
  var app = this;

  options = options || {};

  if (!app.plugins.http) {
    throw new Error('`http` plugin is required to use `view`');
  }

  // * `options.dir`: Explicit path to views directory
  // * `options.root`: Relative root to the views directory ('/app/views')
  // * `app.root`: Relative root to the views directory ('/app/views')
  if (options.dir || options.root || app.root) {
    app._viewsDir = options.dir
      || path.join(options.root || app.root, 'app', 'views');

    app._layoutsDir = options.layouts || path.join(app._viewsDir, 'layouts');
    app._defaultLayout = options.layout || 'app';
  }

  app.locals = app.locals || {};
  app.engines = app.engines || {};

  /*
   * API to register template engines
   */
  app.engine = function (ext, fn) {
    if (ext[0] !== '.') {
      ext = '.' + ext;
    }

    if (!app._defaultEngine) {
      app._defaultEngine = ext;
    }

    app.engines[ext] = fn;
  };

  /*
   * API to set common locals
   */
  app.local = function (key, value) {
    app.locals[key] = value;
  }

  function engineView(name, options, fn) {
    var exists = fs.existsSync || path.existsSync,
        ext = path.extname(name);

    if (!ext) name += (ext = app._defaultEngine);

    // Lookup path
    if (!exports.isAbsolute(name)) {
      name = path.join(app._viewsDir, name);
    }
    if (!exists(name)) {
      return fn(new Error('Failed to lookup view'));
    }

    try {
      app.engines[ext](name, options, fn);
    } catch(err) {
      fn(err);
    }
  };

  app.http.attach = app.http.attach || {};
  app.http.attach.locals = {};

  /*
   * Attach the render method to thisArg
   */
  app.http.attach.render = function (name, options, fn) {
    var self = this, view,
        options = options || {};

    if (typeof options === 'function') {
      fn = options;
      options = {};
    }

    options = common.mixin({}, app.locals, this.locals, options);
    app.http.attach.locals = {};

    fn = fn || function (err, str) {
      if (err) self.res.emit('error', err);
      self.res.html(str);
    };

    // TODO: Caching of views
    if (!view) {
      engineView(name, options, fn);
    }
  };
};

exports.isAbsolute = function (filepath) {
  // Unix
  if (filepath[0] == '/') return true;
  // Windows
  if (filepath[1] == ':' && filepath[2] == '\\') return true;
  return false;
}
