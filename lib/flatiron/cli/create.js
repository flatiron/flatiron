var fs = require('fs'),
    path = require('path'),
    flatiron = require('../../flatiron'),
    common = flatiron.common,
    async = common.async,
    directories = common.directories,
    cpr = common.cpr,
    app = flatiron.app;

module.exports = function create(name, callback) {
  name = name || 'flatiron-app';
  
  var root = path.join(process.cwd(), name),
      type = app.argv.cli ? 'cli' : 'http',
      scaffold = path.join(__dirname, '..', '..', '..', 'scaffolds', type);
  
  //
  // Creates directories specified in `/scaffolds/:type/directories.json`.
  //
  function createDirs(next) {
    var dirs = directories.normalize(root, 
      JSON.parse(fs.readFileSync(path.join(scaffold, 'directories.json'), 'utf8'))
    );

    Object.keys(dirs).forEach(function (name) {
      app.log.info('Creating directory ' + name.grey);
    });
    
    directories.create(dirs, next);
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
  
  //
  // Writes the `app.js` 
  //
  function writeApp(next) {
    app.log.info('Writing ' + 'app.js'.grey);
    cpr(path.join(scaffold, 'app.js'), path.join(root, 'app.js'), next);
  }
  
  //
  // Writes the top-level include for the app
  //
  function writeMain(next) {
    app.log.info('Writing ' + ('lib/index.js').grey);
    fs.writeFile(path.join(root, 'lib', 'index.js'), '', next);
  }
  
  app.log.info('Creating application ' + name.magenta)
  app.log.info('Using ' + type.yellow + ' scaffold.');
  async.series([
    createDirs,
    createPackage,
    writeApp,
    writeMain
  ], function onComplete(next) {
      app.log.info('Application ' + name.magenta + ' is now ready');
      callback();
    }
  );
}

module.exports.usage = [
  'Generates a flatiron skeleton application. By default',
  'an HTTP application will be created.',
  '',
  'create <app-name>',
  '',
  'Command options:',
  '  --cli   Creates a CLI application'
];
