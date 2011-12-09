var fs = require('fs'),
    path = require('path'),
    common = require('broadway').common,
    directories = common.directories,
    app = require('../../lib/flatiron').app;

var create = module.exports = function create(name, callback) {
  name = name || 'flatiron-app';

  var root = path.join(process.cwd(), name),
      dirs;
  
  dirs = directories.normalize(root, {
    config: '#ROOT/config',
    lib: '#ROOT/lib',
    commands: '#ROOT/lib/commands',
    test: '#ROOT/test'
  });
  
  Object.keys(dirs).forEach(function (name) {
    app.log.info('Creating directory ' + name.grey);
  });
  
  directories.create(dirs, function() {
    var pkg = {
      name: name,
      private: true,
      version: '0.0.0',
      dependencies: {
        flatiron: JSON.parse(fs.readFileSync(__dirname + '/../../package.json')).version
      },
      devDependencies: {
        vows: '0.5.x'
      },
      scripts: {
        test: 'vows',
        start: 'node app.js'
      }
    }
    
    var template = [
      'var flatiron = require(\'flatiron\'),',
      '    path = require(\'path\')',
      '    app = flatiron.app;',
      '',
      'app.use(flatiron.plugins.cli, {',
      '  dir: path.join(__dirname,\'lib\',\'commands\'),',
      '  usage: \'Empty Flatiron Application, please fill out commands\'',
      '});',
      '',
      'if (require.main === module) {',
      '  app.init(function () {',
      '    app.start();',
      '  });',
      '}'
    ].join('\n') + '\n';
    
    app.log.info('Writing package.json');
    fs.writeFile(path.join(root, 'package.json'), JSON.stringify(pkg, null, ' ') + '\n');
    
    app.log.info('Writing app.js');
    fs.writeFile(path.join(root, 'app.js'), template);
    
    app.log.info('Writing lib/' + name + '.js');
    fs.writeFile(path.join(root, 'lib', name + '.js'), '');
    
    app.log.info('Application ' + name.magenta + ' is now ready');
    callback();
  });
}

create.usage = [
  'create :appname - generate a flatiron skeleton application'
];
