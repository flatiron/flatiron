/*
 * ecstatic.js: Top-level plugin exposing ecstatic's static server to flatiron app
 *
 * (C) 2012, Nodejitsu, Inc.
 * MIT LICENSE
 *
 */

var path = require('path'),
    flatiron = require('../../flatiron'),
    common = flatiron.common,
    ecstatic;

try {
  //
  // Attempt to require ecstatic.
  //
  ecstatic = require('ecstatic');
}
catch (ex) {
  //
  // Do nothing since this is a progressive enhancement
  //
  console.warn('flatiron.plugins.ecstatic requires the `ecstatic` module from npm');
  console.warn('install using `npm install ecstatic`.');
  console.trace();
  process.exit(1);
}

exports.name = 'ecstatic';

exports.attach = function (options) {
  var app = this;

  options = options || {};

  //
  // Accept string `options`
  //
  if (typeof options === 'string') {
    options = { root: options };
  }

  //
  // Attempt to merge defaults passed to `app.use(flatiron.plugins.ecstatic)`
  // with any additional configuration that may have been loaded
  options = common.mixin(
    {},
    options,
    app.config.get('ecstatic') || {}
  );

  app.config.set('ecstatic', options);

  //
  // `app.static` api to be used by other plugins
  // to server static files
  //
  app.static = function (dir) {
    app.http.before = app.http.before.concat(ecstatic(dir, options));
  }

  // * `options.dir`: Explicit path to assets directory
  // * `options.root`: Relative root to the assets directory ('/app/assets')
  // * `app.root`: Relative root to the assets directory ('/app/assets')
  if (options.dir || options.root || app.root) {
    app._ecstaticDir = options.dir
      || path.join(options.root || app.root, 'app', 'assets');

    //
    // Serve ecstaticDir using middleware in union
    //
    app.static(app._ecstaticDir);
  }
}
