/*
 * plates.js: Top-level plugin for exposing plates to flatiron app
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var path = require('path'),
    fs = require('fs'),
    flatiron = require('../../flatiron'),
    plates;

try {
  //
  // Attempt to require plates
  //
  plates = require('plates');
}
catch (ex) {
  //
  // Do nothing since this is a progressive enhancement
  //
  console.warn('flatiron.plugins.plates requires the `plates` module from npm');
  console.warn('install using `npm install plates`.');
  console.trace();
  process.exit(1);
}

exports.name = 'plates';

exports.attach = function (options) {
  var app = this;

  if (!options) {
    options = {};
  }

  exports._platesDir = options.dir || path.join(__dirname, 'views');
  exports._layoutsDir = path.join(exports._platesDir, 'layouts');
  exports._defaultLayout = 'app';
  exports._extname = '.html'

  //TODO: Need to disbale caching for development
  exports._cachedViews = {};
  exports._cachedLayouts = {};

  app.view = function (view, data, options) {
    if (!options) {
      options = {};
    }

    var layout = options.layout || exports._defaultLayout;

    if (!exports._cachedViews[view]) {
      exports._cachedViews[view] = exports.readFileSync(path.join(exports._platesDir, view + exports._extname));
    }
    var html = exports._cachedViews[view];

    if (layout) {
      if (!exports._cachedLayouts[layout]) {
        exports._cachedLayouts[layout] = exports.readFileSync(path.join(exports._layoutsDir, layout + exports._extname));
      }
      html = plates.bind(exports._cachedLayouts[layout], { body: html });
    }
    return plates.bind(html, data);
  }
}

exports.readFile = function (file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (ex) {
    return '';
  }
}
