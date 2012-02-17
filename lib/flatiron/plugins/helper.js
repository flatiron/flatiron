/*
 * helper.js: Top-level plugin for using helpers in flatiron app
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var path = require('path'),
    fs = require('fs'),
    flatiron = require('../../flatiron'),
    app;

exports.name = 'helper';

exports.attach = function (options) {
  app = this;

  if (!options) {
    options = {};
  }

  app.helpers = {data: {}, presenter: '', action: ''};
  app.helpers.render = exports._render;
  app.helpers.redirect = exports._redirect;

  exports._helpersDir = options.dir || path.join(options.root, 'app', 'helpers');

  //TODO: No caching during development
  var files = app.tryReaddirSync(exports._helpersDir);
  files.forEach(function (file) {
    if (file != '.gitkeep') {
      require(path.join(exports._helpersDir, file));
    }
  });
};

exports._render = function (view, options) {
  view = view || {};

  if (typeof view == 'object') {
    options = view;
    view = this.presenter + '/' + this.action;
  }

  view = view.split('/');
  if (view.length == 1) {
    view.unshift(this.presenter);
  }

  this.res.html(app.view(view.join('/'), this.data, options));
};

exports._redirect = function (url) {
  if (url[0] == '/') {
    url = 'http://' + this.req.headers.host + url;
  }
  this.res.writeHead(302, {'Location': url});
  this.res.end();
};
