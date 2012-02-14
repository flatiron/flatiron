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

  app.resource = resourceful;
  if (options) {
    app._resourceDir = options.dir;
  }

  fs.readdir(app._resourceDir, function (err, files) {
    if (err) {
      app.log.warn(app._resourceDir.grey + ' does not exist.');
    } else {
      files.forEach(function (file) {
        if (file != '.gitkeep') {
          //TODO: Load modules synchronously
          require(path.join(app._resourceDir, path.basename(file)));
        }
      });
    }
  });
};
