/*
 * resourceful.js: Top-level plugin exposing resourceful to flatiron app
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var path = require('path'),
    fs = require('fs'),
    flatiron = require('../../flatiron'),
    resourceful;

try {
  //
  // Attempt to require resourceful.
  //
  resourceful = require('resourceful');
}
catch (ex) {
  //
  // Do nothing since this is a progressive enhancement
  //
  console.warn('flatiron.plugins.resourceful requires the `resourceful` module from npm');
  console.warn('install using `npm install resourceful`.');
  console.trace();
  process.exit(1);
}

exports.name = 'resourceful';

exports.attach = function (options) {
  var app = this;

  if (!options) {
    options = {};
  }

  app.resource = resourceful;

  if (options.dir || options.root) {
    app._resourceDir = options.dir || path.join(options.root, 'app', 'resources');

    var files = app.tryReaddirSync(app._resourceDir);
    files.forEach(function (file) {
      if (file[0] != '.') {
        require(path.join(app._resourceDir, file));
      }
    });
  }
};
