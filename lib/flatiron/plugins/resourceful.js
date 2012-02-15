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
  exports._resourceDir = options.dir || path.join(__dirname, 'resources');

  fs.readdir(exports._resourceDir, function (err, files) {
    if (err) {
      app.log.warn(exports._resourceDir.grey + ' does not exist.');
    } else {
      files.forEach(function (file) {
        if (file != '.gitkeep') {
          require(path.join(exports._resourceDir, path.basename(file)));
        }
      });
    }
  });
};
