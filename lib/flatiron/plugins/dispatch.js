/*
 * dispatch.js: Top-level plugin for dispatching routes in flatiron app
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var path = require('path'),
    fs = require('fs'),
    flatiron = require('../../flatiron'),
    app;

exports.name = 'dispatch';

exports.attach = function (options) {
  app = this;

  if (!options) {
    options = {};
  }

  app.routes = {};
  app.presenters = {};

  exports._presentersDir = options.dir || path.join(options.root, 'app', 'presenters');
  exports._routes = options.routes || path.join(options.root, 'config', 'routes.js');

  //TODO: No caching during development
  var files = app.tryReaddirSync(exports._presentersDir);
  files.forEach(function (file) {
    if (file != '.gitkeep') {
      require(path.join(exports._presentersDir, file));
    }
  });

  require(exports._routes).call(new exports._routesBuilder());
};

exports._routesBuilder = function (scope) {
  var self = this;
  this._scope = scope || app.routes;

  this.root = function (action) {
    action = action.split('/');
    if (exports._checkAction(action)) {
      this._scope['/'] = exports._methods(app.presenters[action[0]][action[1]]);
    }
  };

  this.match = function (url, action, options) {
    options = options || {};
    action = action.split('/');
    if (exports._checkAction(action)) {
      this._scope['/' + url] = exports._methods(app.presenters[action[0]][action[1]], options.via);
    }
  };

  this.api = function (resource) {
    //TODO: CRUD
  };

  this.scope = function (name, func) {
    name = '/' + name;
    this._scope[name] = {};
    func.call(new exports._routesBuilder(this._scope[name]));
  };

  ['get', 'post', 'put', 'delete'].forEach(function (method) {
    self[method] = function (action) {
      action = action.split('/');
      if (exports._checkAction(action)) {
        var name = '/' + action.join('/');
        this._scope[name] = {};
        this._scope[name][method] = app.presenters[action[0]][action[1]];
      }
    };
  });

  return this;
};

exports._checkAction = function (action) {
  if (action.length == 2) {
    if (app.presenters[action[0]]) {
      if (app.presenters[action[0]][action[1]]) {
        return true;
      } else {
        app.log.warn('No action named ' + action[1].red + ' in presenter ' + action[0].cyan);
      }
    } else {
      app.log.warn('No presenter named ' + action[0].red);
    }
  } else {
    app.log.warn('Wrong action format ' + action.join('/').red);
  }
  return false;
};

exports._methods = function (func, via) {
  var ret = {};
  via = via || ['get', 'post', 'put', 'patch', 'delete'];
  via.forEach(function (method) {
    ret[method] = func;
  });
  return ret;
};
