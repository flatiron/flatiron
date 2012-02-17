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
  app.presentersBefore = {};

  exports._presentersDir = options.dir || path.join(options.root, 'app', 'presenters');
  exports._routes = options.routes || path.join(options.root, 'config', 'routes.js');

  //TODO: No caching during development
  var files = app.tryReaddirSync(exports._presentersDir);
  files.forEach(function (file) {
    if (file[0] != '.') {
      require(path.join(exports._presentersDir, file));
    }
  });

  for (var i in app.presenters) {
    var actions = {};
    app.presentersBefore[i] = {};

    for (var j in app.presenters[i]) {
      if (j[0] != '_') {
        actions[j] = true;
        app.presentersBefore[i][j] = [];
      }
    }

    if (app.presenters[i]._before) {
      app.presenters[i]._before.forEach(function (before) {
        if (before.only) {
          before.only.forEach(function (action) {
            app.presentersBefore[i][action].push(before.exec);
          });
        } else {
          if (before.except) {
            for (var j in before.except) {
              delete actions[before.except[j]];
            }
          }
          Object.keys(actions).forEach(function (action) {
            app.presentersBefore[i][action].push(before.exec);
          });
        }
      });
    }
  }

  require(exports._routes).call(new exports._routesBuilder());
};

exports._routesBuilder = function (scope) {
  var self = this;
  this._scope = scope || app.routes;

  this.root = function (action) {
    action = action.split('/');
    if (exports._checkAction(action)) {
      this._scope['/'] = exports._methods(this._scope['/'] || {}, exports._action(action));
    }
  };

  this.match = function (url, action, options) {
    options = options || {};
    action = action.split('/');
    if (exports._checkAction(action)) {
      this._scope['/' + url] = exports._methods(this._scope['/' + url] || {}, exports._action(action), options.via);
    }
  };

  this.api = function (resource) {
    this.scope(resource, function () {
      this.match('', resource + '/index', {via: ['get']});
      this.match('', resource + '/create', {via: ['post']});
      this.match(':id', resource + '/show', {via: ['get']});
      this.match(':id', resource + '/update', {via: ['put']});
      this.match(':id', resource + '/destroy', {via: ['delete']});
    });
  };

  this.resource = function (resource) {
    this.scope(resource, function () {
      this.match('', resource + '/index', {via: ['get']});
      this.match('new', resource + '/new', {via: ['get']});
      this.match('', resource + '/create', {via: ['post']});
      this.match(':id', resource + '/show', {via: ['get']});
      this.match(':id/edit', resource + '/edit', {via: ['get']});
      this.match(':id', resource + '/update', {via: ['put']});
      this.match(':id', resource + '/destroy', {via: ['delete']});
    });
  };

  this.scope = function (name, func) {
    name = '/' + name;
    this._scope[name] = this._scope[name] || {};
    func.call(new exports._routesBuilder(this._scope[name]));
  };

  ['get', 'post', 'put', 'patch', 'delete'].forEach(function (method) {
    self[method] = function (action) {
      action = action.split('/');
      if (exports._checkAction(action)) {
        var name = '/' + action.join('/');
        self._scope[name] = self._scope[name] || {};
        self._scope[name][method] = exports._action(action);
      }
    };
  });

  return this;
};

exports._action = function (action) {
  var actionFunc = function () {
    var self = this;
    this.arguments = arguments;
    this.presenter = action[0];
    this.action = action[1];

    flatiron.common.async.forEachSeries(
      app.presentersBefore[action[0]][action[1]], function (exec, callback) {
        if (app.presenters[action[0]][exec]) {
          app.presenters[action[0]][exec].apply(self, [callback].concat(self.arguments));
        } else {
          callback();
        }
      }, function (err) {
        app.presenters[action[0]][action[1]].apply(self, self.arguments);
      }
    );
  };
  return actionFunc;
};

exports._checkAction = function (action) {
  if (action.length == 2) {
    if (app.presenters[action[0]]) {
      if (app.presenters[action[0]][action[1]]) {
        if (action[1][0] == '_') {
          app.log.warn('Action name can not start with _ in ' + action[1].red);
        } else {
          return true;
        }
      } else {
        app.log.warn('No action named ' + action[1].red + ' in presenter ' + action[0].green);
      }
    } else {
      app.log.warn('No presenter named ' + action[0].red);
    }
  } else {
    app.log.warn('Wrong action format ' + action.join('/').red);
  }
  return false;
};

exports._methods = function (ret, func, via) {
  via = via || ['get', 'post', 'put', 'patch', 'delete'];
  via.forEach(function (method) {
    ret[method] = func;
  });
  return ret;
};
