/*
 * resourceful.js: Top-level plugin exposing resourceful to flatiron app
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var path = require('path'),
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

  options = options || {};

  //
  // Create `app.r` if it does not exist already.
  // Initialize it with some resourceful helpers
  //
  app.r = app.r || {
    define: function (name, definition) {
      if ((typeof name === 'function' || typeof name === 'object') && !definition) {
        definition = name;
        name = definition.name;
      }
      app.r[flatiron.common.capitalize(name)] = resourceful.define(name, definition);
    }
  };

  //
  // Lazy-load the resources directory based on a few intelligent defaults:
  //
  // * `options.dir`: Explicit path to resources directory
  // * `options.root`: Relative root to the resources directory ('/app/resources')
  // * `app.root`: Relative root to the resources directory ('/app/resources')
  //
  if (options.dir || options.root || app.root) {
    app._resourceDir = options.dir
      || path.join(options.root || app.root, 'app', 'resources');

    flatiron.common.tryReaddirSync(app._resourceDir).forEach(function (file) {
      file = file.replace('.js', '');
      require(path.resolve(app._resourceDir, file));
    });
  }

  //
  // TODO: Determine how best to integrate `restful` here.
  //
};

exports.init = function (done) {
  var app = this,
      options;

  //
  // Attempt to merge defaults passed to `app.use(flatiron.plugins.resourceful)`
  // with any additional configuration that may have been loaded.
  //
  options = flatiron.common.mixin(
    {},
    app.options['resourceful'],
    app.config.get('resourceful') || {}
  );

  app.config.set('resourceful', options);

  //
  // Remark: Should we accept the autoMigrate option?
  //
  if (options.engine) {
    resourceful.use(options.engine, options);
  }

  done();
};
