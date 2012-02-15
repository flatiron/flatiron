var fs = require('fs'),
    path = require('path'),
    flatiron = require('../../flatiron'),
    common = flatiron.common,
    app = flatiron.app;

module.exports = function create(name, type, callback) {
  name = name || 'flatiron-app';
  type = type || 'http';

  var root = path.join(process.cwd(), name),
      scaffold = path.join(__dirname, '..', '..', '..', 'scaffolds', type);

  if (common.isAppRoot(root, type)) {
    app.log.error('Destination app ' + name.magenta + ' already exists and is not an empty directory.');
    return;
  }

  var create = JSON.parse(fs.readFileSync(path.join(scaffold, 'create.json'), 'utf8'));
  var files = create.files;
  var dirs = create.dirs;

  //
  // Creates directories specified in `/scaffolds/:type/directories.json`.
  //
  function createDirs(next) {
    dirs.forEach(function (dir) {
      app.log.info('Creating directory ' + dir.grey);
    });

    common.dirs.create(root, dirs, next);
  }

  //
  // Creates files specified in `/scaffolds/:type/files.json`.
  //
  function createFiles(next) {
    files.forEach(function (file) {
      app.log.info('Writing file ' + file.grey);
    });

    common.files.create(scaffold, root, files, next);
  }

  //
  // Creates a templated package.json from `/scaffolds/:type/package.json`.
  //
  function createPackage(next) {
    var pkg = JSON.parse(fs.readFileSync(path.join(scaffold, 'package.json'), 'utf8'));

    pkg.name = name;
    pkg.dependencies.flatiron = flatiron.version;

    app.log.info('Writing ' + 'package.json'.grey);
    fs.writeFile(path.join(root, 'package.json'), JSON.stringify(pkg, null, 2) + '\n', next);
  }

  app.log.info('Creating application ' + name.magenta)
  app.log.info('Using ' + type.yellow + ' scaffold.');
  common.async.series([
    createDirs,
    createPackage,
    createFiles
  ], function onComplete(next) {
      app.log.info('Application ' + name.magenta + ' is now ready');
      callback();
    }
  );
}

module.exports.usage = [
  'Generates a flatiron skeleton application. If no <type>',
  'is specified an HTTP application will be created.',
  '',
  'create <app-name> <type>',
];
